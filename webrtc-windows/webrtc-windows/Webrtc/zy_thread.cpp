// zy_thread.cpp: implementation of the thread class.
//
//////////////////////////////////////////////////////////////////////
#include "zy_thread.h"
CzyThread::CzyThread() : autoDelete_(FALSE)
{
	autoDelete_ = FALSE;
	tid = 0;
	threadStatus = THREAD_STATUS_NEW;
}
CzyThread::~CzyThread()
{
}
bool CzyThread::Start()
{
	tid = (DWORD)CreateThread(NULL, 0, thread_proxy_func, this, 0, NULL);
	return (tid == 0);
}

pthread_t CzyThread::getThreadID()
{
	return tid;
}

int CzyThread::getState()
{
	return threadStatus;
}

void CzyThread::Join()
{
	if (tid > 0)
	{
		WaitForSingleObject((HANDLE)tid, INFINITE);
	}
}

DWORD WINAPI CzyThread::thread_proxy_func(LPVOID args)
{
	CzyThread * pThread = static_cast<CzyThread *>(args);

	pThread->Run();
	CloseHandle((HANDLE)pThread->tid);

	if (pThread->autoDelete_)
	{
		delete pThread;
	}
	return NULL;
}

void CzyThread::SetAutoDelete(bool autoDelete)
{
	autoDelete_ = autoDelete;
}
