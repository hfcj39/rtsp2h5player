#include "customRTSPClient.hh"

customRTSPClient* customRTSPClient::createNew(UsageEnvironment& env, char const* rtspURL, const char* username, const char* password, bool usetcp,
	int verbosityLevel, char const* applicationName,void* handle,live555responseHandler* reponsehandler,void* live555responseData,portNumBits tunnelOverHTTPPortNum) {
	return new customRTSPClient(env, rtspURL, username, password, usetcp,verbosityLevel,applicationName, handle,reponsehandler,live555responseData,tunnelOverHTTPPortNum);
}

customRTSPClient::customRTSPClient(UsageEnvironment& env, char const* rtspURL, const char* username, const char* password, bool usetcp,
	int verbosityLevel, char const* applicationName, void* handle, live555responseHandler* reponsehandler, void* live555responseData, portNumBits tunnelOverHTTPPortNum)
	: RTSPClient(env, rtspURL, verbosityLevel, applicationName, tunnelOverHTTPPortNum, -1) {
	Authenticator* au = new Authenticator(username, password);
	scs.authenticator = au;
	scs.handle = handle;
	scs.responsehandler = reponsehandler;
	scs.responseData = live555responseData;
	scs.usetcp = usetcp;
	eventLoopWatchVariable = 0;
	Success = false;
}

customRTSPClient::~customRTSPClient() {
}
