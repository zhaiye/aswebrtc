#ifndef ZYTHREAD_H
#define ZYTHREAD_H

#include <winsock2.h>
#include "windows.h"

#define	pthread_t	DWORD
class CzyThread
{
public:
	CzyThread();
	virtual ~CzyThread();
private:
	pthread_t tid;
	int threadStatus;
	static DWORD WINAPI thread_proxy_func(LPVOID pThreadArgs);
public:
	bool autoDelete_;
	static const int THREAD_STATUS_NEW = 0;
	static const int THREAD_STATUS_RUNNING = 1;
	static const int THREAD_STATUS_EXIT = -1;
	void SetAutoDelete(bool autoDelete);
	virtual void Run() = 0;
	bool Start();
	pthread_t getThreadID();
	int getState();
	void Join();
};
#endif /* ZYTHREAD_H */