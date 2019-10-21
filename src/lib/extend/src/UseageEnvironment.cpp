#include "UseageEnvironment.hh"
#include <stdio.h>

////////// BasicUsageEnvironment //////////

#if defined(__WIN32__) || defined(_WIN32)
extern "C" int initializeWinsockIfNecessary();
#endif

UseageEnvironment::UseageEnvironment(TaskScheduler& taskScheduler)
	: BasicUsageEnvironment0(taskScheduler) {
#if defined(__WIN32__) || defined(_WIN32)
	if (!initializeWinsockIfNecessary()) {
		setResultErrMsg("Failed to initialize 'winsock': ");
		reportBackgroundError();
		internalError();
	}
#endif
}

UseageEnvironment::~UseageEnvironment() {
}

UseageEnvironment*
UseageEnvironment::createNew(TaskScheduler& taskScheduler) {
	return new UseageEnvironment(taskScheduler);
}

int UseageEnvironment::getErrno() const {
#if defined(__WIN32__) || defined(_WIN32) || defined(_WIN32_WCE)
	return WSAGetLastError();
#else
	return errno;
#endif
}

UsageEnvironment& UseageEnvironment::operator<<(char const* str) {
#ifdef _DEBUG
	if (str == NULL) str = "(NULL)"; // sanity check
	fprintf(stderr, "%s", str);
#endif
	return *this;
}

UsageEnvironment& UseageEnvironment::operator<<(int i) {
#ifdef _DEBUG
	fprintf(stderr, "%d", i);
#endif
	return *this;
}

UsageEnvironment& UseageEnvironment::operator<<(unsigned u) {
#ifdef _DEBUG
	fprintf(stderr, "%u", u);
#endif
	return *this;
}

UsageEnvironment& UseageEnvironment::operator<<(double d) {
#ifdef _DEBUG
	fprintf(stderr, "%f", d);
#endif
	return *this;
}

UsageEnvironment& UseageEnvironment::operator<<(void* p) {
#ifdef _DEBUG
	fprintf(stderr, "%p", p);
#endif
	return *this;
}
