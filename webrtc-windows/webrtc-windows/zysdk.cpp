#include "zysdk.h"
#include "Webrtc/internals.h"
#include "Webrtc/conductor.h"

#include "turbojpeg/TJpeg.h"

#pragma comment(lib,"crypt32.lib")
#pragma comment(lib,"iphlpapi.lib")
#pragma comment(lib,"secur32.lib")
#pragma comment(lib,"winmm.lib")
#pragma comment(lib,"dmoguids.lib")
#pragma comment(lib,"wmcodecdspuuid.lib")
#pragma comment(lib,"amstrmid.lib")
#pragma comment(lib,"msdmo.lib")
#pragma comment(lib,"Strmiids.lib")

// common
#pragma comment(lib,"wininet.lib")
#pragma comment(lib,"dnsapi.lib")
#pragma comment(lib,"version.lib")
#pragma comment(lib,"msimg32.lib")
#pragma comment(lib,"ws2_32.lib")
#pragma comment(lib,"usp10.lib")
#pragma comment(lib,"psapi.lib")
#pragma comment(lib,"dbghelp.lib")
#pragma comment(lib,"shlwapi.lib")
#pragma comment(lib,"kernel32.lib")
#pragma comment(lib,"gdi32.lib")
#pragma comment(lib,"winspool.lib")
#pragma comment(lib,"comdlg32.lib")
#pragma comment(lib,"advapi32.lib")
#pragma comment(lib,"shell32.lib")
#pragma comment(lib,"ole32.lib")
#pragma comment(lib,"oleaut32.lib")
#pragma comment(lib,"user32.lib")
#pragma comment(lib,"uuid.lib")
#pragma comment(lib,"odbc32.lib")
#pragma comment(lib,"odbccp32.lib")
#pragma comment(lib,"delayimp.lib")
#pragma comment(lib,"credui.lib")
#pragma comment(lib,"netapi32.lib")

// internal
#pragma comment(lib,"liblept168.lib")
#pragma comment(lib,"turbojpeg-static.lib")

// unknown
#pragma comment(lib,"builtin_audio_decoder_factory.lib")
#pragma comment(lib,"field_trial_default.lib")
#pragma comment(lib,"metrics_default.lib")
#pragma comment(lib,"neteq.lib")
#pragma comment(lib,"opus.lib")
#pragma comment(lib,"red.lib")
#pragma comment(lib,"rent_a_codec.lib")
#pragma comment(lib,"level_indicator.lib")
#pragma comment(lib,"cng.lib")
#pragma comment(lib,"ana_config_proto.lib")
#pragma comment(lib,"ana_debug_dump_proto.lib")

#pragma comment(lib,"g711.lib")
#pragma comment(lib,"g711_c.lib")
#pragma comment(lib,"g722.lib")
#pragma comment(lib,"g722_c.lib")
#pragma comment(lib,"ilbc.lib")
#pragma comment(lib,"ilbc_c.lib")
#pragma comment(lib,"isac.lib")
#pragma comment(lib,"isac_c.lib")
#pragma comment(lib,"isac_common.lib")
#pragma comment(lib,"isac_fix.lib")
#pragma comment(lib,"isac_fix_c.lib")
#pragma comment(lib,"pcm16b.lib")
#pragma comment(lib,"pcm16b_c.lib")

// etc
#pragma comment(lib,"protobuf_lite.lib")
#pragma comment(lib,"winsdk_samples.lib")
#pragma comment(lib,"dl.lib")
#pragma comment(lib,"simd.lib")
#pragma comment(lib,"file_player.lib")
#pragma comment(lib,"file_recorder.lib")

#pragma comment(lib,"rtc_base.lib")
#pragma comment(lib,"rtc_base_approved.lib")
#pragma comment(lib,"rtc_event_log_impl.lib")  //old
#pragma comment(lib,"rtc_event_log_proto.lib")
#pragma comment(lib,"rtc_media.lib")
#pragma comment(lib,"rtc_p2p.lib")
#pragma comment(lib,"rtc_pc.lib")
#pragma comment(lib,"rtp_rtcp.lib")
#pragma comment(lib,"rtc_task_queue.lib")
#pragma comment(lib,"rtc_stats.lib")
#pragma comment(lib,"rtc_media_base.lib")
#pragma comment(lib,"rtc_numerics.lib")

#pragma comment(lib,"audio.lib")
#pragma comment(lib,"audio_coding.lib")
#pragma comment(lib,"audio_conference_mixer.lib")
#pragma comment(lib,"audio_format.lib")
#pragma comment(lib,"audio_format_conversion.lib")
#pragma comment(lib,"audio_network_adaptor.lib")
#pragma comment(lib,"audio_decoder_interface.lib")
#pragma comment(lib,"audio_device.lib")
#pragma comment(lib,"audio_encoder_interface.lib")
#pragma comment(lib,"audio_processing.lib")
#pragma comment(lib,"audio_processing_c.lib")
#pragma comment(lib,"audio_processing_sse2.lib")
#pragma comment(lib,"audioproc_debug_proto.lib")
#pragma comment(lib,"audio_coder.lib")
#pragma comment(lib,"audio_frame_operations.lib")
#pragma comment(lib,"audio_mixer_impl.lib")
#pragma comment(lib,"audio_frame_manipulator.lib")

#pragma comment(lib,"video.lib")
#pragma comment(lib,"video_capture_internal_impl.lib")
#pragma comment(lib,"video_coding.lib")
#pragma comment(lib,"video_capture_module.lib")
#pragma comment(lib,"video_coding_utility.lib")
#pragma comment(lib,"video_processing.lib")
#pragma comment(lib,"video_processing_sse2.lib")
#pragma comment(lib,"video_frame_api.lib")

#pragma comment(lib,"webrtc_common.lib")
#pragma comment(lib,"webrtc_h264.lib")
#pragma comment(lib,"webrtc_i420.lib")
#pragma comment(lib,"webrtc_opus.lib")
#pragma comment(lib,"webrtc_opus_c.lib")
#pragma comment(lib,"webrtc_vp9.lib")

#pragma comment(lib,"libjingle_peerconnection.lib")
#pragma comment(lib,"system_wrappers.lib")
#pragma comment(lib,"voice_engine.lib")
#pragma comment(lib,"call.lib")
#pragma comment(lib,"call_interfaces.lib")

// modules
#pragma comment(lib,"pacing.lib")
#pragma comment(lib,"utility.lib")
#pragma comment(lib,"media_file.lib")
#pragma comment(lib,"remote_bitrate_estimator.lib")
#pragma comment(lib,"common_audio.lib")
#pragma comment(lib,"common_audio_c.lib")
#pragma comment(lib,"common_audio_sse2.lib")
#pragma comment(lib,"common_video.lib")
#pragma comment(lib,"congestion_controller.lib")
#pragma comment(lib,"bitrate_controller.lib")

#pragma comment(lib,"boringssl.lib")
#pragma comment(lib,"boringssl_asm.lib")
#pragma comment(lib,"usrsctp.lib")
#pragma comment(lib,"libyuv.lib")
#pragma comment(lib,"libjpeg.lib")
#pragma comment(lib,"libsrtp.lib")
#pragma comment(lib,"libstunprober.lib")

#pragma comment(lib,"libvpx.lib")
#pragma comment(lib,"libvpx_intrinsics_avx.lib")
#pragma comment(lib,"libvpx_intrinsics_avx2.lib")
#pragma comment(lib,"libvpx_intrinsics_mmx.lib")
#pragma comment(lib,"libvpx_intrinsics_sse2.lib")
#pragma comment(lib,"libvpx_intrinsics_sse4_1.lib")
#pragma comment(lib,"libvpx_intrinsics_ssse3.lib")
#pragma comment(lib,"libvpx_yasm.lib")

#pragma comment(lib,"webrtc_vp8_no_impl.lib") // for hacking vp8_impl.cc

 //enable webrtc::DesktopCapturer
#define DESKTOP_CAPTURE 0

#if DESKTOP_CAPTURE
#pragma comment(lib,"desktop_capture.lib")
#pragma comment(lib,"desktop_capture_differ_sse2.lib")
#pragma comment(lib,"primitives.lib")
#pragma comment(lib,"dxgi.lib")
#pragma comment(lib,"d3d11.lib")
//#endif
#endif

namespace Native
{
	bool CFG_quality_scaler_enabled_ = false;
}

void cjosnPackSend(int t, int code, fcbglobalCallback fcbglobalcall, char* context)
{
	cJSON* root = cJSON_CreateObject();
	cJSON_AddNumberToObject(root, "t", t);
	cJSON_AddNumberToObject(root, "code", code);
	cJSON_AddStringToObject(root, "context", context);
	char* out = cJSON_Print(root);
	cJSON_Delete(root);
	fcbglobalcall(out);
	free(out);
}

fcbglobalCallback* fcbglobal = NULL;//所有信息汇总
int __stdcall sdk_global_callback(char* globalcall)
{
	if (fcbglobal != NULL)
	{
		fcbglobal(globalcall);
	}
	return 0;
}
void set_global_callback(fcbglobalCallback _fcbglobal)
{
	fcbglobal = _fcbglobal;
}
void GetVideoDevices(fcbglobalCallback _fcbdevice)
{
	std::vector<std::string> devices = Conductor::GetVideoDevices();
	for (const auto & name : devices)
	{
		cJSON* root = cJSON_CreateObject();
		cJSON_AddStringToObject(root, "name", name.c_str());
		char* out = cJSON_Print(root);
		cJSON_Delete(root);
		cjosnPackSend(FROM_SDK_WEBRTC, ZY_CLIENT_WEBRTC_GETDEVICE, _fcbdevice, out);
		free(out);
	}
}
//webrtc
void InitWebRtc()
{
	rtc::EnsureWinsockInit();
	rtc::InitializeSSL(NULL);
}
void UninitWebRtc()
{
	rtc::CleanupSSL();
}
HANDLE CreatPeerConnection(char* socketId, OnRenderCallbackNative onRenderLocal, OnRenderCallbackNative onRenderRemote, int nVideoWidth, int nVideoHeight)
{
	Conductor *pObj = new Conductor(nVideoWidth, nVideoHeight);
	pObj->fcbglobalcall = sdk_global_callback;
	pObj->SetAutoDelete(FALSE);
	pObj->onRenderLocal = onRenderLocal;
	pObj->onRenderRemote = onRenderRemote;
	strncpy(pObj->socketId, socketId, strlen(socketId) + 1);

	return pObj;
}
BOOL OpenVideoCaptureDevice(HANDLE hObj, char* devName)
{
	Conductor *pObj = (Conductor *)hObj;
	return pObj->OpenVideoCaptureDevice(devName);
}
BOOL StartPeerConnection(HANDLE hObj)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->Start();
	int nTime = 20;
	while (nTime--)
	{
		if (pObj->bInitOK)
			break;
		Sleep(500);
	}
	if (!pObj->bInitOK)
		return NULL;
	return TRUE;
}
void StopPeerConnection(HANDLE hObj)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->bStop = TRUE;
}
void AddServerConfig(HANDLE hObj, char* sthost, char* username, char* credential)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->AddServerConfig(sthost, username, credential);
}
void CreateOffer(HANDLE hObj)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->CreateOffer();
}
void OnOfferReply(HANDLE hObj, char* type, char* sdp)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->OnOfferReply(type, sdp);
}
void OnOfferRequest(HANDLE hObj, char* sdp)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->OnOfferRequest(sdp);
}
BOOL AddIceCandidate(HANDLE hObj, char* sdp_mid, int sdp_mlineindex, char* sdp)
{
	Conductor *pObj = (Conductor *)hObj;


	return pObj->AddIceCandidate(sdp_mid, sdp_mlineindex, sdp);
}
void CreateDataChannel(HANDLE hObj, char* label)
{
	Conductor *pObj = (Conductor *)hObj;
	pObj->CreateDataChannel(label);
}
BOOL DataChannelSendText(HANDLE hObj, char* text)
{
	Conductor *pObj = (Conductor *)hObj;
	return pObj->DataChannelSendText(text);
}
BOOL DataChannelSendBuf(HANDLE hObj, char* data)
{
	Conductor *pObj = (Conductor *)hObj;
	rtc::CopyOnWriteBuffer writeBuffer(data, strlen(data));
	return pObj->DataChannelSendData(webrtc::DataBuffer(writeBuffer, true));
}
TurboJpegEncoder tjEncoder;
int EncodeI420(HANDLE hObj, uint8_t* rgbBuf, int w, int h, int pxFormat, long yuvSize, bool fast)
{
	Conductor *pObj = (Conductor *)hObj;
	if (pObj->bStop)return -1;
	uint8_t* yuv = pObj->VideoCapturerI420Buffer();
	int nRes = tjEncoder.EncodeI420(rgbBuf, w, h, pxFormat, yuvSize, fast, yuv);

	pObj->PushFrame();
	return nRes;
}
int EncodeI420toBGR24(uint8_t* yuvBuf, int w, int h, uint8_t* rgbBuf, bool fast)
{
	return tjEncoder.EncodeI420toBGR24(yuvBuf, w, h, rgbBuf, fast);
}
//#end
