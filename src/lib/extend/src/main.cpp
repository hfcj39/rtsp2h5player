#include "Live555Decoder.hh"
#include "FLVClient.hh"
FLVClient* client = NULL;
void oncallback(char* data, int len, int timestamp, void* callback){
	client->DataCallBack((unsigned char*)data, len, timestamp);
}
int main(int argc, char* argv[])
{
	if (argc > 1){
		client = FLVClient::CreateNew();
		VirtualDecoder* decoder = Live555Decoder::CreateNew(argv[1]);
		decoder->SetOnFrameCallback(oncallback, NULL);
		decoder->start();
	}
	return 0;
}

