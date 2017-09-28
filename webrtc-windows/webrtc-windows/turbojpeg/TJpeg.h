#ifndef TJPEG_H_
#define TJPEG_H_
#pragma once

#include "turbojpeg.h"
#include "webrtc/base/win32.h"
class TurboJpegEncoder
{
public:
	TurboJpegEncoder();
	~TurboJpegEncoder();

	int EncodeI420(uint8_t* rgbBuf, int w, int h, int pxFormat, long yuvSize, bool fast, uint8_t* yuv);
	int EncodeI420toBGR24(uint8_t* yuv, int w, int h, uint8_t* bgrBuffer, bool fast);
private:
	tjhandle jpeg;
	tjhandle jpegc;
};

#endif  // TJPEG_H_
