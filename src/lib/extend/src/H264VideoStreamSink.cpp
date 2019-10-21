/**********
This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the
Free Software Foundation; either version 2.1 of the License, or (at your
option) any later version. (See <http://www.gnu.org/copyleft/lesser.html>.)

This library is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for
more details.

You should have received a copy of the GNU Lesser General Public License
along with this library; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
**********/
// "liveMedia"
// Copyright (c) 1996-2015 Live Networks, Inc.  All rights reserved.
// H.264 Video File sinks
// Implementation

#include "H264VideoStreamSink.hh"

////////// H264VideoFileSink //////////

H264VideoStreamSink
::H264VideoStreamSink(UsageEnvironment& env,
live555responseHandler* handle, void* live555responseData,
char const* sPropParameterSetsStr,
unsigned bufferSize)
: H264or5VideoStreamSink(env, bufferSize, handle, live555responseData,
sPropParameterSetsStr, NULL, NULL) {
}

H264VideoStreamSink::~H264VideoStreamSink() {
}

H264VideoStreamSink*
H264VideoStreamSink::createNew(UsageEnvironment& env,
live555responseHandler* handle, void* live555responseData,
char const* sPropParameterSetsStr,unsigned bufferSize) {
	return new H264VideoStreamSink(env, handle,live555responseData,sPropParameterSetsStr, bufferSize);
}
