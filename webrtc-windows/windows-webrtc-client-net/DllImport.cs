using System;
using System.Runtime.InteropServices;

namespace windows_webrtc_client_net
{
    class DllImport
    {
        //websocket client
        public enum importag
        {
            FROM_SDK_WEBRTC = 40,

            ZY_CLIENT_WEBRTC_ONSUCCESS = 600,           //webrtc,OnSuccess 成功返回
            ZY_CLIENT_WEBRTC_ONICECANDIDATE = 601,      //webrtc,OnIceCandidate 成功返回
            ZY_CLIENT_WEBRTC_ONMESSAGE = 602,           //收到的消息回调
            ZY_CLIENT_WEBRTC_ONDATACHANNEL_CLOSE = 603, //通道退出消息
            ZY_CLIENT_WEBRTC_GETDEVICE = 604,			//获取设备
        }

        //
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void set_global_callback(fcbglobalCallback _fcbglobal);

        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void GetVideoDevices();

        //webrtc
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void InitWebRtc();
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void UninitWebRtc();
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool OpenVideoCaptureDevice(IntPtr hObj, string devName);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr CreatPeerConnection(string socketId, OnRenderCallbackNative onRenderLocal, OnRenderCallbackNative onRenderRemote, int nVideoWidth, int nVideoHeight);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool StartPeerConnection(IntPtr hObj);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void StopPeerConnection(IntPtr hObj);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void AddServerConfig(IntPtr hObj, string sthost, string username, string credential);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void CreateOffer(IntPtr hObj);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void OnOfferReply(IntPtr hObj, string type, string sdp);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void OnOfferRequest(IntPtr hObj, string sdp);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool AddIceCandidate(IntPtr hObj, string sdp_mid, int sdp_mlineindex, string sdp);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern void CreateDataChannel(IntPtr hObj, string label);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool DataChannelSendText(IntPtr hObj, string text);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern int EncodeI420(IntPtr hObj, IntPtr rgbBuf, int w, int h, int pxFormat, long yuvSize, bool fast);
        [DllImport("webrtc-windows", CallingConvention = CallingConvention.Cdecl)]
        public static extern int EncodeI420toBGR24(IntPtr yuvBuf, int w, int h, [MarshalAs(UnmanagedType.LPArray)]byte[] rgbBuf, bool fast);

        //
        [UnmanagedFunctionPointerAttribute(CallingConvention.StdCall, CharSet = CharSet.Ansi)]
        public delegate int fcbglobalCallback(string globalcall);
        [UnmanagedFunctionPointerAttribute(CallingConvention.StdCall, CharSet = CharSet.Ansi)]
        public delegate int fcbVideoRGBCodec(byte[] pInBuf, int iInLen);
        [UnmanagedFunctionPointerAttribute(CallingConvention.StdCall, CharSet = CharSet.Ansi)]
        public delegate void OnRenderCallbackNative(IntPtr yuv, int w, int h);
    }
}
