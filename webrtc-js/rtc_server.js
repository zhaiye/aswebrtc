/** 
 * 简单的基于webrtc的网页服务端 
 * Simple based on webrtc web service side
 *  
 * zhaiye
 * tgmaa@163.com
 *  
 * 本例子实现一个网页客户端与网页服务端交互的简单程序。 
 * 
 * This example implements a web client, a simple example of interacting with the server.
 *  
 */

//信令服务
var host = "webrtc.tgmaa.cn";
//https://webrtc.tgmaa.cn,创建私有ID
var UserID = "test";
var Password = "a9f696454710384bf228047acba4d5ef";

var rtc_ws = null;
var nativePeerConnection = window.RTCPeerConnection;
var nativeRTCSessionDescription = window.RTCSessionDescription;
var nativeRTCIceCandidate = (window.RTCIceCandidate);

var dataChannels = {};
var ClientPeerConnList = {};
var localMediaStream = null;

var pcConstraints = {
    'optional': []
};

//stun/turn
var servers = {
    iceServers:
             [
                 { "url": "stun:stun.l.google.com:19302" },
                 { "url": "stun:stun.xten.com" },
             ]
};
//数据通道发送测试
var sendTryCount = 0;
function rtc_send(msg, socketId) {
    if (dataChannels[socketId] && dataChannels[socketId].readyState == "open") {
        dataChannels[socketId].send(JSON.stringify(msg));
        console.log("Message sending success!");
    }
    else {
        if (sendTryCount++ == 10)
        {
            sendTryCount = 0;
            delSinglePeerConn(socketId);
        }
        console.log("Message sending failed!");
    }
}
var testNum = 0;
function setDataChannel(dc) {
    dc.onerror = function (error) {
        console.log("DataChannel Error:", error);
    };
    dc.onmessage = function (event) {
        labe2.innerHTML = event.data;
    };
    dc.onopen = function () {
        console.log("DataChannel open");
    };
    dc.onclose = function () {
        console.log("DataChannel is Closed");

        for (var socketId in dataChannels) {
            if (dataChannels[socketId] == dc) {
                delSinglePeerConn(socketId);
            }
        }
    };
}
function delSinglePeerConn(socketId)
{
    //console.log("DataChannel is Closed remove:" + socketId + ":" + ClientPeerConnList[socketId]);
    labe2.innerHTML = "DataChannel is Closed remove:" + socketId;
    dataChannels[socketId].close();
    delete dataChannels[socketId];
    ClientPeerConnList[socketId].close();
    delete ClientPeerConnList[socketId];
}
function delAllPeerConn() {
    for (var socketId in dataChannels) {
        delSinglePeerConn(socketId);
    }
    if (rtc_ws) {
        rtc_ws.close();
        rtc_ws = null;
    }
    labe2.innerHTML = "已关闭";
    document.getElementById('Button1').value = "连接";
}
//创建peer连接
function createPeerConnection(socketId, sdp) {

    var pc = new nativePeerConnection(servers, pcConstraints);
    ClientPeerConnList[socketId] = pc;
    
    if (localMediaStream) {
        pc.addStream(localMediaStream);
    }
    dataChannels[socketId] = pc.createDataChannel("sendDataChannel", null);
    setDataChannel(dataChannels[socketId]);
    pc.onaddstream = function (e) {
        console.log("pc.onaddstream");
    };
    pc.onicecandidate = function (event) {
        if (event.candidate != null)
        {
            console.log("pc.onicecandidate:" + JSON.stringify(event.candidate));
            var sdata = {};
            sdata["command"] = "__OnIceCandidate";
            sdata["socketId"] = socketId;
            sdata["sdp_mid"] = event.candidate.sdpMid;
            sdata["sdp_mline_index"] = event.candidate.sdpMLineIndex;
            sdata["sdp"] = event.candidate.candidate;
            ws_Send(sdata);
        }
    };
    pc.ondatachannel = function (e) {
        console.log("pc.ondatachannel");
    };
    pc.createOffer = function (e) {
        console.log("pc.createOffer");
    };
    pc.setRemoteDescription(new nativeRTCSessionDescription({ type: "offer", sdp: sdp }),
         function () {
             pc.createAnswer(function (session_desc) {
                 pc.setLocalDescription(session_desc);
                 var sdata = {};
                 sdata["command"] = "__OnSuccessAnswer";
                 sdata["socketId"] = socketId;
                 sdata["sdp"] = session_desc.sdp;
                 ws_Send(sdata);
             }, function (errorInformation) {
                 console.log(errorInformation);
             });
         },
         function (errorInformation) {
             console.log('setRemoteDescription error: ' + errorInformation);
    });
}
//信令服务
function ws_Send(data) {
    try {
        rtc_ws.send(JSON.stringify(data));
    }
    catch (ex) {
        console.log("Message sending failed!");
    }
}
function wsconnect() {
    //var ua = window.navigator.userAgent.toLowerCase();
    //if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //    rtc_ws = new WebSocket("ws://" + host + ":9000");
    //} else {
    //    rtc_ws = new WebSocket("wss://" + host + ":9001");
    //}
    rtc_ws = new WebSocket("ws://" + host + ":9000");
    rtc_ws.onopen = function () {
        var sdata = {};
        sdata["command"] = "__UserCreate";
        var udata = {};
        udata["UserID"] = UserID;
        udata["Password"] = Password;
        sdata["udata"] = udata;
        ws_Send(sdata);

        console.log("Socket connected!");
        labe2.innerHTML = "Socket connected!";

        ////与信令服务器保持连接,允许新加入客户端
        //setInterval(function () {
        //    ws_Send(0);
        //}, 1000 * 20);
        document.getElementById('Button1').value = "断开";
    };
    rtc_ws.onclose = function () {
        console.log("webSocket connection has been disconnected!");

        delAllPeerConn();
    };
    rtc_ws.onerror = function (err) {
        labe2.innerHTML = "Socket error :" + err.message;
    };
    rtc_ws.onmessage = function (Message) {
        var obj = JSON.parse(Message.data);
        var command = obj.command;
        switch (command) {
            case "__OnLoginSuccessful": {
                if (!localMediaStream)
                    getLocalStream();
            }
            break;
            case "__OnError": {
                labe2.innerHTML = obj.info;
            }
            break;
            case "__Offer": {
                createPeerConnection(obj.socketId, obj.desc.sdp);
            }
            break;
        }
    };
}
//获取相关音视频设备
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

var videoElement = document.getElementById('vidLocal');
var audioInputSelect = document.querySelector('select#audioSource');
var audioOutputSelect = document.querySelector('select#audioOutput');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [audioInputSelect, audioOutputSelect, videoSelect];

audioInputSelect.onchange = getLocalStream;
videoSelect.onchange = getLocalStream;

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    var values = selectors.map(function (select) {
        return select.value;
    });
    selectors.forEach(function (select) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label ||
                'microphone ' + (audioInputSelect.length + 1);
            audioInputSelect.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || 'speaker ' +
                (audioOutputSelect.length + 1);
            audioOutputSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    selectors.forEach(function (select, selectorIndex) {
        if (Array.prototype.slice.call(select.childNodes).some(function (n) {
          return n.value === values[selectorIndex];
        })) {
            select.value = values[selectorIndex];
        }
    });
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console

    //videoElement.srcObject = stream;
    //videoElement.onloadedmetadata = function (e) {
    //    videoElement.play();
    //};
    
    localMediaStream = stream;
    console.log("localMediaStream chang.");
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}

function getLocalStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }
    //获取选择的设备
    var audioSource = audioInputSelect.value;
    var videoSource = videoSelect.value;
    //过滤设备
    var constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: {
            deviceId: videoSource ? { exact: videoSource } : undefined, "width": {
                "max": "640"
            },
            "height": {
                "max": "480"
            },
            "frameRate": {
                "max": "25"
            }
        }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}