#include "Live555Decoder.hh"

Live555Decoder::Live555Decoder(char* rtsplink, bool usetcp)
	:VirtualDecoder()
{
	if (rtsplink)
		_url = rtsplink;
	flag = 0;
	isrunning = false;
	fusetcp = usetcp;
}

void Live555Decoder::OnReconnect(int times)
{
	fusetcp = !fusetcp;
	c_Delay(1000);
#ifdef _DEBUG
	//printf("Ready to reconnect %d\n",times);
#endif
}

int Live555Decoder::ParseRTSPlink(char* src, char* rtsplink, char* username, char* password)
{
	int len = strlen(src);
	//find @
	int i = 0,j = 0;
	for (i = 0; i < len; i++){
		if (src[i] == '@'){
			break;
		}
	}
	if (i == len){
		strcpy(rtsplink, src);
		username = "";
		password = "";
		return 0;
	}
	else{
		rtsplink[0] = 'r';rtsplink[1] = 't';rtsplink[2] = 's';rtsplink[3] = 'p';
		rtsplink[4] = ':';rtsplink[5] = '/';rtsplink[6] = '/';
		strcpy(rtsplink + 7, src + i + 1);
	}
	for (j = 7; j < len; j++){
		if (src[j] == ':'){
			break;
		}
	}
	if (j == len){
		strcpy(rtsplink, src);
		username = "";
		password = "";
	}
	else{
		if (i > j){
			memcpy(username, &src[7], j - 7);
			memcpy(password, &src[j + 1], i - j - 1);
		}
	}
	return 0;
}

Live555Decoder* Live555Decoder::CreateNew(char* rtsplink, char* username,char* password,bool usetcp /*= true*/)
{
	int len = strlen(rtsplink); 
	if (len > 7){
		if (username == NULL && password == NULL){
			return new Live555Decoder(rtsplink, usetcp);
		}
		else{
			char tmplink[256] = { 0 };
			strcpy(tmplink, rtsplink + 7);
			std::string _username = username;
			std::string _password = password;
			std::string retlink = "rtsp://" + _username + ":" + _password + "@" + tmplink;
			return new Live555Decoder((char*)retlink.c_str(), usetcp);
		}
	}
	else{
		return NULL;
	}
}

Live555Decoder* Live555Decoder::CreateNew(char* rtsplink, bool usetcp /*= true*/)
{
	//parse rtsp url start
	//auto rtsp link : rtsp://user:pass@link
	return new Live555Decoder(rtsplink,usetcp);
}
void Live555Decoder::callbackdatastatic(void *t, unsigned char* data, unsigned int length, unsigned int timestamp){
	Live555Decoder* c_live555 = (Live555Decoder*)t;
	c_live555->callbackdata(data,length,timestamp);
}
void Live555Decoder::callbackdata(unsigned char* data, unsigned int length, unsigned int timestamp)
{
	if (PresentationTime == ~0){
		PresentationTime = c_TickCount();
	}
	PresentationBytesLength += length;
	OnFrameCallback((char*)data, length, timestamp, OnFrameData);
}
int Live555Decoder::MainLoop(){
	isrunning = true;
	while (isrunning){
		rtsp = RTSP::CreateNew();
		if (rtsp){
			char tmplink[256] = { 0 };
			char tmpusername[32] = { 0 };
			char tmppassword[32] = { 0 };
			ParseRTSPlink((char*)_url.c_str(), tmplink, tmpusername, tmppassword);
			client = rtsp->openURL(tmplink, tmpusername, tmppassword, fusetcp, Live555Decoder::callbackdatastatic, (void*)this);
			if (client){
				rtsp->Start(client);
			}
		}
		if (isrunning){
			_times++;
			OnReconnect(_times);
		}
	}
	//printf("Connection closed");
	delete rtsp;
	rtsp = NULL;
	return 0;
}
Live555Decoder::~Live555Decoder(void)
{

}

void Live555Decoder::stop()
{
	isrunning = false;
	if (rtsp && client)
		rtsp->Stop(client);
	//ugly code to wait mainloop to stop
	while (rtsp)
		c_Delay(1);
	//delete rtsp;
}
