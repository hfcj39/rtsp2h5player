CXX=g++
CC=gcc
CPPINCLUDE += -O3 -I./live/liveMedia/include -I./live/BasicUsageEnvironment/include -I./live/groupsock/include -I./live/UsageEnvironment/include
CPPFLAGS += $(CPPINCLUDE) -fpermissive -Wdeprecated-declarations -w -O3 -std=c++11
CPPLDFLAGS += -L./live/liveMedia -L./live/BasicUsageEnvironment -L./live/groupsock -L./live/UsageEnvironment -lliveMedia -lBasicUsageEnvironment -lgroupsock -lUsageEnvironment
CPPSOURCES=$(wildcard *.cpp)
CPPOBJECTS=$(CPPSOURCES:.cpp=.o)
CSOURCES=$(wildcard *.c)
COBJECTS=$(CSOURCES:.c=.o)
TARGET=live555client

.PHONY: all clean

all: .dcpp .dc $(CPPSOURCES) $(CSOURCES) $(TARGET)

.dcpp: $(CPPSOURCES)
	$(CXX) $(CPPFLAGS) -MM $(CPPSOURCES) >.dcpp
.dc: $(CSOURCES)
	$(CC) $(CFLAGS) -MM $(CSOURCES) >.dc
-include .dcpp
-include .dc
$(TARGET): $(CPPOBJECTS) $(COBJECTS)
	$(CXX) $(CPPOBJECTS) $(COBJECTS) -o $@ $(CPPLDFLAGS)

clean:
	rm $(CPPOBJECTS) $(COBJECTS) .dcpp .dc
install:
	cp $(TARGET) /usr/local/bin
