#pragma once
#ifndef _BASIC_USAGE_ENVIRONMENT0_HH
#include "BasicUsageEnvironment0.hh"
#endif

class UseageEnvironment : public BasicUsageEnvironment0 {
public:
	static UseageEnvironment* createNew(TaskScheduler& taskScheduler);

	// redefined virtual functions:
	virtual int getErrno() const;

	virtual UsageEnvironment& operator<<(char const* str);
	virtual UsageEnvironment& operator<<(int i);
	virtual UsageEnvironment& operator<<(unsigned u);
	virtual UsageEnvironment& operator<<(double d);
	virtual UsageEnvironment& operator<<(void* p);

protected:
	UseageEnvironment(TaskScheduler& taskScheduler);
	// called only by "createNew()" (or subclass constructors)
	virtual ~UseageEnvironment();
};

