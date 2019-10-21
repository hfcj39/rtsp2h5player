#include "VirtualDecoder.hh"
#ifdef WIN32
#include <Windows.h>
#endif


VirtualDecoder::VirtualDecoder(void){
	flag = 0;
	OnFrameCallback = NULL;
	OnFrameData = NULL;
	_times = 0;
	PresentationTime = ~0;
	PresentationBytesLength = 0;
}

void VirtualDecoder::ChangeURL(std::string url){
	_url = url;
}

unsigned long VirtualDecoder::c_TickCount(){
#ifdef WIN32
	return GetTickCount();
#else
	struct timespec ts;
	clock_gettime(CLOCK_MONOTONIC, &ts);
	return (ts.tv_sec * 1000 + ts.tv_nsec / 1000000);
#endif
}

int VirtualDecoder::c_Delay(unsigned long usec)
{
#ifdef WIN32
	Sleep((DWORD) (usec));
#else
	usleep(usec * 1000);
#endif
	return 0;
}
void VirtualDecoder::start(){
	MainLoopstatic(this);
}

unsigned int VirtualDecoder::getSpeed()
{
	unsigned long timenow = c_TickCount();
	unsigned int ret = 0;
	if (timenow - PresentationTime != 0){
		ret = PresentationBytesLength / (timenow - PresentationTime);
	}
	PresentationBytesLength = 0;
	PresentationTime = timenow;
	return ret;
}

VirtualDecoder* VirtualDecoder::CreateNew(void){
	return new VirtualDecoder();
}
VirtualDecoder::~VirtualDecoder(void){
}
int VirtualDecoder::MainLoopstatic(void* data)
{
	VirtualDecoder* decoder = (VirtualDecoder*) data;
	if (decoder){
		return decoder->MainLoop();
	}
	return 0;
}

void VirtualDecoder::OnReconnect(int times)
{

}

void VirtualDecoder::stop()
{

}

void VirtualDecoder::SetOnFrameCallback(OnFrame* callback, void* data)
{
	OnFrameCallback = callback;
	OnFrameData = data;
}

int VirtualDecoder::MainLoop()
{
	return 0;
}
