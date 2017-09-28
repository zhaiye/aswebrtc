
#ifndef ZYSDK_H_
#define ZYSDK_H_
#pragma once

#include "webrtc/base/win32.h"

enum
{
	FROM_SDK_WEBRTC = 40,

	ZY_CLIENT_WEBRTC_ONSUCCESS = 600,           //webrtc,OnSuccess 成功返回
	ZY_CLIENT_WEBRTC_ONICECANDIDATE = 601,      //webrtc,OnIceCandidate 成功返回
	ZY_CLIENT_WEBRTC_ONMESSAGE = 602,           //收到的消息回调
	ZY_CLIENT_WEBRTC_ONDATACHANNEL_CLOSE = 603, //通道退出消息
	ZY_CLIENT_WEBRTC_GETDEVICE = 604,			//获取设备
};

typedef int(__stdcall fcbglobalCallback)(char* callerror);
typedef void(__stdcall *OnRenderCallbackNative)(uint8_t * yuv, uint32_t w, uint32_t h);

typedef void(__stdcall *OnRenderCallbackNative)(uint8_t * BGR24, uint32_t w, uint32_t h);

extern "C" {

	void set_global_callback(fcbglobalCallback _fcbglobal);

	void cjosnPackSend(int t, int code, fcbglobalCallback fcbglobalcall, char* context);

	void GetVideoDevices(fcbglobalCallback _fcbdevice);
	//webrtc
	void InitWebRtc();
	void UninitWebRtc();
	BOOL OpenVideoCaptureDevice(HANDLE hObj, char* devName);
	HANDLE CreatPeerConnection(char* socketId, OnRenderCallbackNative onRenderLocal, OnRenderCallbackNative onRenderRemote, int nVideoWidth, int nVideoHeight);
	BOOL StartPeerConnection(HANDLE hObj);
	void StopPeerConnection(HANDLE hObj);
	void AddServerConfig(HANDLE hObj, char* sthost, char* username, char* credential);
	void CreateOffer(HANDLE hObj);
	void OnOfferReply(HANDLE hObj, char* type, char* sdp);
	void OnOfferRequest(HANDLE hObj, char* sdp);
	BOOL AddIceCandidate(HANDLE hObj, char* sdp_mid, int sdp_mlineindex, char* sdp);
	void CreateDataChannel(HANDLE hObj, char* label);
	BOOL DataChannelSendText(HANDLE hObj, char* text);
	BOOL DataChannelSendBuf(HANDLE hObj, char* data);
	int EncodeI420(HANDLE hObj,uint8_t* rgbBuf, int w, int h, int pxFormat, long yuvSize, bool fast);
	int EncodeI420toBGR24(uint8_t* yuvBuf, int w, int h, uint8_t* rgbBuf, bool fast);
};

#endif  // ZYSDK_H_
