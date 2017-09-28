#include "TJpeg.h"

TurboJpegEncoder::TurboJpegEncoder()
{
	jpeg = tjInitDecompress();
	jpegc = tjInitCompress();
}

TurboJpegEncoder::~TurboJpegEncoder()
{
	tjDestroy(jpeg);
	tjDestroy(jpegc);
}
int TurboJpegEncoder::EncodeI420(uint8_t* rgbBuf, int w, int h, int pxFormat, long yuvSize, bool fast, uint8_t* yuv)
{
	int pad = 4;
	int width = w;
	int height = h;
	int pitch = TJPAD(tjPixelSize[pxFormat] * width);
	if (yuvSize > 0)
	{
		int yuvSizeCheck = tjBufSizeYUV2(width, pad, height, TJSAMP_420);
		if (yuvSizeCheck != yuvSize)
		{
			return -1;
		}
	}
	int r = tjEncodeYUV3(jpegc, rgbBuf, width, pitch, height, pxFormat, yuv, pad, TJSAMP_420, fast ? TJFLAG_FASTDCT : TJFLAG_ACCURATEDCT);
	if (r != 0)
	{
		return r;
	}
	return 0;
}
int TurboJpegEncoder::EncodeI420toBGR24(uint8_t* yuv, int w, int h, uint8_t* bgrBuffer, bool fast)
{
	int pad = 4;
	int width = w;
	int height = h;
	int pitch = TJPAD(tjPixelSize[TJPF_BGR] * width);

	int r = tjDecodeYUV(jpeg, yuv, pad, TJSAMP_420, bgrBuffer/*&bgrBuffer[0]*/, width, pitch, height, TJPF_BGR, fast ? TJFLAG_FASTDCT : TJFLAG_ACCURATEDCT);
	if (r != 0)
	{
		return r;
	}
	return 0;
}
