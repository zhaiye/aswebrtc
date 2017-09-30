using System;
using System.Collections;
using System.Collections.Concurrent;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Threading;

using WebSocketSharp;
using Newtonsoft.Json;
namespace windows_webrtc_server_net
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        static string exthost = "webrtc.tgmaa.cn";
        //https://webrtc.tgmaa.cn,创建私有ID
        static string UserID = "test";
        static string Password = "a9f696454710384bf228047acba4d5ef";
        static string StunIP1 = "stun:stun.l.google.com:19302";
        static string StunIP2 = "stun:stun.xten.com";
        public const bool audio = true;
        public const int screenWidth = 640;
        public const int screenHeight = 480;
        class tagpeer
        {
            public IntPtr peerconn;
            public DllImport.OnRenderCallbackNative _OnRenderLocal = null;
        }
        static ConcurrentDictionary<string, tagpeer> OnlinePeerList = new ConcurrentDictionary<string, tagpeer>();
        static WebSocket wsclient = null;
        static Form1 staticform;
        static int set_global_callback(string globalcall)
        {
            Hashtable ht = JsonConvert.DeserializeObject<Hashtable>(globalcall);
            string t = ht["t"].ToString();
            if(t == ((int)DllImport.importag.FROM_SDK_WEBRTC).ToString())
            {
                string code = ht["code"].ToString();
                if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_ONSUCCESS).ToString())
                {
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());
                    wsclient.Send(JsonConvert.SerializeObject(new {
                        command = "__OnSuccessAnswer",
                        sdp = contextht["sdp"],
                        socketId = contextht["socketId"]
                    }));
                }
                else if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_ONICECANDIDATE).ToString())
                {
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());
                    wsclient.Send(JsonConvert.SerializeObject(new
                    {
                        command = "__OnIceCandidate",
                        sdp_mid = contextht["sdp_mid"],
                        sdp_mline_index = contextht["sdp_mline_index"],
                        sdp = contextht["sdp"],
                        socketId = contextht["socketId"]
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
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());
                    removepeerconn(contextht["socketId"].ToString());
                }
            }
            return 0;
        }
        static int set_devcie_callback(string globalcall)
        {
            Hashtable ht = JsonConvert.DeserializeObject<Hashtable>(globalcall);
            string t = ht["t"].ToString();
            if (t == ((int)DllImport.importag.FROM_SDK_WEBRTC).ToString())
            {
                string code = ht["code"].ToString();
                if (code == ((int)DllImport.importag.ZY_CLIENT_WEBRTC_GETDEVICE).ToString())
                {
                    Hashtable contextht = JsonConvert.DeserializeObject<Hashtable>(ht["context"].ToString());
                    staticform.BeginInvoke(new MethodInvoker(delegate ()
                    {
                        staticform.comboBoxVideo.Items.Add(contextht["name"]);
                    }));
                }
            }
            return 0;
        }
        static void removepeerconn(string socketId)
        {
            tagpeer objpeer;
            OnlinePeerList.TryRemove(socketId, out objpeer);
            
            staticform.BeginInvoke(new MethodInvoker(delegate ()
            {
                staticform.label1.Text = "peerobj Remove:" + socketId;
            }));
        }
        byte[] bgrBuffremote;
        Bitmap remoteImg;
        void OnRenderLocal(IntPtr yuv, int w, int h)
        {
            lock (staticform.pictureBoxLocal)
            {
                if (bgrBuffremote == null)
                    bgrBuffremote = new byte[w * 3 * h];
                if (DllImport.EncodeI420toBGR24(yuv, w, h, bgrBuffremote, true) == 0)
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
            lock (f.pictureBoxLocal)
            {
                if (f.pictureBoxLocal.Image == null)
                {
                    f.pictureBoxLocal.Image = f.remoteImg;
                }
                f.pictureBoxLocal.Invalidate();
            }
        });
        DllImport.fcbglobalCallback _set_global_callback;
        private void Form1_Load(object sender, EventArgs e)
        {
            staticform = this;

            staticform.comboBoxVideo.Items.Add("请选择摄像头");
            DllImport.GetVideoDevices(set_devcie_callback);

            _set_global_callback = set_global_callback;
            DllImport.set_global_callback(_set_global_callback);
            DllImport.InitWebRtc();

            startPeerconn();

            System.Windows.Forms.Timer timertcsend = new System.Windows.Forms.Timer();
            timertcsend.Interval = 1000;
            timertcsend.Tick += timerRTCSend_Tick;
            timertcsend.Start();

            System.Windows.Forms.Timer timerVirtualCam = new System.Windows.Forms.Timer();
            timerVirtualCam.Interval = 1000 / captureFps;
            timerVirtualCam.Tick += timerVirtualCam_Tick;
            timerVirtualCam.Start();
        }
        void startPeerconn()
        {
            wsclient = new WebSocket("ws://" + exthost + ":9000");

            wsclient.OnOpen += (wsender, wse) =>
            {
                string smsg = JsonConvert.SerializeObject(new
                {
                    command = "__UserCreate",
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
                        }
                        break;
                    case "__OnError":
                        {
                            this.BeginInvoke(new MethodInvoker(delegate ()
                            {
                                label1.Text = ht["info"].ToString();
                            }));
                        }
                        break;
                    case "__Offer":
                        {
                            tagpeer objpeer = new tagpeer();
                            objpeer._OnRenderLocal = OnRenderLocal;
                            objpeer.peerconn = DllImport.CreatPeerConnection(ht["socketId"].ToString(), objpeer._OnRenderLocal, null, screenWidth, screenHeight);
                            DllImport.AddServerConfig(objpeer.peerconn, StunIP1, "", "");
                            DllImport.AddServerConfig(objpeer.peerconn, StunIP2, "", "");
                            if (!string.IsNullOrEmpty(videoDevice) && videoDevice != "请选择摄像头")
                            {
                                if (!DllImport.OpenVideoCaptureDevice(objpeer.peerconn, videoDevice))
                                {
                                    MessageBox.Show("摄像头打开失败");
                                }
                            }
                            object sdp = JsonConvert.DeserializeObject<Hashtable>(ht["desc"].ToString())["sdp"];
                            if (DllImport.StartPeerConnection(objpeer.peerconn))
                            {
                                OnlinePeerList.TryAdd(ht["socketId"].ToString(), objpeer);
                                DllImport.OnOfferRequest(objpeer.peerconn, sdp.ToString());
                            }
                        }
                        break;
                }
            };

            wsclient.Connect();
        }

        static int send_test_num = 0;
        private void timerRTCSend_Tick(object sender, EventArgs e)
        {
            foreach(var v in OnlinePeerList)
            {
                DllImport.DataChannelSendText(v.Value.peerconn, "Hello RTC Server," + send_test_num++ + ",server peerconn.num:" + OnlinePeerList.Count);
            }
        }
        Bitmap img;
        Graphics g;
        IntPtr imgBufPtr = IntPtr.Zero;
        readonly byte[] imgBuf = new byte[screenWidth * 3 * screenHeight];
        public const int captureFps = 25;
        private void timerVirtualCam_Tick(object sender, EventArgs e)
        {
            if (img == null)
            {
                var bufHandle = GCHandle.Alloc(imgBuf, GCHandleType.Pinned);
                imgBufPtr = bufHandle.AddrOfPinnedObject();
                img = new Bitmap(screenWidth, screenHeight, screenWidth * 3, PixelFormat.Format24bppRgb, imgBufPtr);
                g = Graphics.FromImage(img);
            }
            g.Clear(Color.DarkBlue);

            var rc = RectangleF.FromLTRB(0, 0, img.Width, img.Height);
            g.DrawString(string.Format("{0}", DateTime.Now.ToString("hh:mm:ss.fff")), fBig, Brushes.LimeGreen, rc, sfTopRight);

            foreach (var v in OnlinePeerList)
            {
                unsafe
                {
                    var imgbuf = (IntPtr)imgBufPtr.ToPointer();
                    DllImport.EncodeI420(v.Value.peerconn, imgbuf, screenWidth, screenHeight, 1, 0, true);
                }
            }
        }
        static readonly Font fBig = new Font("Tahoma", 12);
        static readonly StringFormat sfTopRight = new StringFormat()
        {
            Alignment = StringAlignment.Far,
            LineAlignment = StringAlignment.Near
        };

        internal string videoDevice = string.Empty;
        private void comboBoxVideo_SelectedIndexChanged(object sender, EventArgs e)
        {
            videoDevice = comboBoxVideo.SelectedItem as string;
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            wsclient.Close();
            DllImport.UninitWebRtc();
        }
    }
}
