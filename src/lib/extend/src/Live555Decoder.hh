#pragma once
#include "VirtualDecoder.hh"
#include "RTSP.hh"
#include <string>

class Live555Decoder :
	public VirtualDecoder
{
public:
	void OnReconnect(int times);
	static int ParseRTSPlink(char* src, char* rtsplink, char* username, char* password);
	static Live555Decoder* CreateNew(char* rtsplink, bool usetcp = true);
	static Live555Decoder* CreateNew(char* rtsplink, char* username, char* password, bool usetcp /*= true*/);
	~Live555Decoder(void);
	static void callbackdatastatic(void *t, unsigned char* data, unsigned int length, unsigned int timestamp);
	void callbackdata(unsigned char* data, unsigned int length, unsigned int timestamp);
	int MainLoop();
	void stop();
protected:
	Live555Decoder(char* rtsplink, bool usetcp);
	std::string m_rtsplink, m_username, m_password;
	RTSP* rtsp;
	RTSPClient* client;
	bool isrunning;
	char flag;
	bool fusetcp;
};

