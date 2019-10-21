#pragma once
#include <time.h>
#include <string>
#ifndef WIN32
#include <unistd.h>
#endif // !WIN32

class VirtualDecoder
{
public:
	typedef void (OnFrame)(char* data,int len,int timestamp,void* callback);
	static VirtualDecoder* CreateNew(void);
	void start();
	virtual unsigned int getSpeed();
	virtual void stop();
	virtual void ChangeURL(std::string url);
	void SetOnFrameCallback(OnFrame* callback, void* data);
	static int MainLoopstatic(void* data);
	virtual int MainLoop();
	virtual ~VirtualDecoder(void);
protected:
	VirtualDecoder(void);
	virtual void OnReconnect(int times);
	unsigned long c_TickCount();
	int c_Delay(unsigned long usec);
	int flag;
	OnFrame* OnFrameCallback;
	void* OnFrameData;
	int _times;
	unsigned long PresentationTime;
	unsigned long PresentationBytesLength;
	std::string _url;
};

