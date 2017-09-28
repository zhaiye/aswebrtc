using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Drawing.Imaging;

using WebSocketSharp;
using Newtonsoft.Json;
namespace windows_webrtc_client_net
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        static string exthost = "webrtc.tgmaa.cn";
	//https://webrtc.tgmaa.cn,创建新的ID
        static string UserID = "test";
        static string Password = "a9f696454710384bf228047acba4d5ef";

        static string StunIP1 = "stun:stun.l.google.com:19302";
        static string StunIP2 = "stun:stun.xten.com";

        static Form1 staticform;
        static string cursocketId;
        static WebSocket wsclient = null;

        public const int screenWidth = 640;
        public const int screenHeight = 480;

        class tagpeer
        {
            public IntPtr peerconn;
            public DllImport.OnRenderCallbackNative _OnRenderRemote = null;
        }
        static tagpeer objpeer;
        static int set_global_callback(string globalcall)
        {
            Hashtable ht = JsonConvert.DeserializeObject<Hashtable>(globalcall);
            string t = ht["t"].ToString();
            if (t == ((int)DllImport.importag.FROM_SDK_WEBRTC).ToString())
            {
                string code = ht["code"].ToString();
                if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_ONSUCCESS).ToString())
                {
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());

                    wsclient.Send(JsonConvert.SerializeObject(new
                    {
                        command = "__Offer",
                        desc = new { sdp = contextht["sdp"], type= contextht["type"] }
                    }));
                }
                else if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_ONMESSAGE).ToString())
                {
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());
                    staticform.BeginInvoke(new MethodInvoker(delegate ()
                    {
                        staticform.label1.Text = contextht["msg"] + "";
                    }));
                }
                else if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_ONDATACHANNEL_CLOSE).ToString())
                {
                }
            }

            return 0;
        }
        byte[] bgrBuffremote;
        Bitmap remoteImg;
        void OnRenderRemote(IntPtr yuv, int w, int h)
        {
            lock (staticform.pictureBoxRemote)
            {
                if(bgrBuffremote == null)
                    bgrBuffremote = new byte[w * 3 * h];
                if (DllImport.EncodeI420toBGR24(yuv, w, h,bgrBuffremote, true) == 0)
                {
                    if (remoteImg == null)
                    {
                        var bufHandle = GCHandle.Alloc(bgrBuffremote, GCHandleType.Pinned);
                        remoteImg = new Bitmap((int)w, (int)h, (int)w * 3, PixelFormat.Format24bppRgb, bufHandle.AddrOfPinnedObject());
                    }
                }
            }
            try
            {
                Invoke(renderRemote, this);
            }
            catch // don't throw on form exit
            {

            }
        }
        readonly Action<Form1> renderRemote = new Action<Form1>(delegate (Form1 f)
        {
            lock (f.pictureBoxRemote)
            {
                if (f.pictureBoxRemote.Image == null)
                {
                    f.pictureBoxRemote.Image = f.remoteImg;
                }
                f.pictureBoxRemote.Invalidate();
            }
        });

        void createPeerConnection()
        {
            objpeer = new tagpeer();
            objpeer._OnRenderRemote = OnRenderRemote;

            objpeer.peerconn = DllImport.CreatPeerConnection(cursocketId, null, objpeer._OnRenderRemote, screenWidth, screenHeight);
            DllImport.AddServerConfig(objpeer.peerconn, StunIP1, "", "");
            DllImport.AddServerConfig(objpeer.peerconn, StunIP2, "", "");
            if (DllImport.StartPeerConnection(objpeer.peerconn))
            {
                DllImport.CreateDataChannel(objpeer.peerconn, string.Empty);

                DllImport.CreateOffer(objpeer.peerconn);
            }
        }
        DllImport.fcbglobalCallback _set_global_callback;
        private void Form1_Load(object sender, EventArgs e)
        {
            staticform = this;
            _set_global_callback = set_global_callback;
            DllImport.set_global_callback(_set_global_callback);
            DllImport.InitWebRtc();

            startPeerconn();

            System.Windows.Forms.Timer timertcsend = new System.Windows.Forms.Timer();
            timertcsend.Interval = 1000;
            timertcsend.Tick += timerRTCSend_Tick;
            timertcsend.Start();
        }
        void startPeerconn()
        {
            wsclient = new WebSocket("ws://"+ exthost + ":9000");

            wsclient.OnOpen += (wsender, wse) =>
            {
                string smsg = JsonConvert.SerializeObject(new
                {
                    command = "__UserJoin",
                    udata = new { UserID = UserID, Password = Password }
                });

                wsclient.Send(smsg);
            };
            wsclient.OnMessage += (wsender, wse) =>
            {
                Hashtable ht = JsonConvert.DeserializeObject<Hashtable>(wse.Data);
                var command = ht["command"].ToString();
                switch (command)
                {
                    case "__OnLoginSuccessful":
                        {
                            cursocketId = ht["socketId"].ToString();
                            createPeerConnection();
                        }
                        break;
                    case "__OnError":
                        {
                            this.BeginInvoke(new MethodInvoker(delegate ()
                            {
                                label1.Text = ht["info"].ToString();
                                button2.Text = "开启";
                            }));
                        }
                        break;
                    case "__OnSuccessAnswer":
                        {
                            DllImport.OnOfferReply(objpeer.peerconn, "answer", ht["sdp"].ToString());
                        }
                        break;
                    case "__OnIceCandidate":
                        {
                            if (ht["sdp"] == null || string.IsNullOrEmpty(ht["sdp"].ToString())) break;
                            DllImport.AddIceCandidate(objpeer.peerconn, ht["sdp_mid"].ToString(), int.Parse(ht["sdp_mline_index"].ToString()), ht["sdp"].ToString());
                        }
                        break;
                }
            };
            wsclient.Connect();
        }
        int send_test_num = 0;
        private void timerRTCSend_Tick(object sender, EventArgs e)
        {
            if(objpeer != null)
                DllImport.DataChannelSendText(objpeer.peerconn, "Hello RTC Client," + send_test_num++ + ",socketId:" + cursocketId);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            wsclient.Close();
            DllImport.UninitWebRtc();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            wsclient.Close();
            if (button2.Text == "关闭")
            {
                if (objpeer != null)
                    DllImport.StopPeerConnection(objpeer.peerconn);
                objpeer = null;
                button2.Text = "开启";
            }
            else
            {
                startPeerconn();
                button2.Text = "关闭";
            }
        }
    }
}
