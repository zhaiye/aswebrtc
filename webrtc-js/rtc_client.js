/** 
 * 简单的基于webrtc的网页客户端 
 * Simple based on webrtc web client
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
//https://webrtc.tgmaa.cn,创建新的ID
var UserID = "test";
var Password = "a9f696454710384bf228047acba4d5ef";

var nativePeerConnection = window.RTCPeerConnection;
var nativeRTCSessionDescription = window.RTCSessionDescription;
var nativeRTCIceCandidate = (window.RTCIceCandidate);

var rtc_ws = null;
var ServerPeerConn = null;
var dataChannel = null;
var cursocketId;

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
function rtc_send(msg) {
    console.log("rtc_send");
    if (dataChannel && dataChannel.readyState == "open") {
        dataChannel.send(JSON.stringify(msg));
    }
    else {
        delPeerConn();
    }
}
function setDataChannel(dc) {
    dc.onerror = function (error) {
        console.log("DataChannel Error:", error);
    };
    dc.onmessage = function (event) {
        labe2.innerHTML = event.data;
    };
    dc.onopen = function () {
        console.log("DataChannel is onopen");

        document.getElementById('Button1').value = "断开";
    };
    dc.onclose = function () {
        console.log("DataChannel is Closed");
        delPeerConn();

        document.getElementById('Button1').value = "连接";
        labe2.innerHTML = "已关闭";
    };
}
function delPeerConn() {
    if (dataChannel) {
        dataChannel.close();
        ServerPeerConn.close();
        dataChannel = ServerPeerConn = null;
    }
    if (rtc_ws) {
        rtc_ws.close();
        rtc_ws = null;
    }
}
function createPeerConnection() {
    console.log("createPeerConnection...");

    ServerPeerConn = new nativePeerConnection(servers, pcConstraints);

    // optional data channel
    dataChannel = ServerPeerConn.createDataChannel("sendDataChannel", null);
    setDataChannel(dataChannel);
    ServerPeerConn.onaddstream = function (e) {
        try {
            console.log("remote media connection success!");

            var vid2 = document.getElementById('vid2');
            vid2.srcObject = e.stream;
            vid2.onloadedmetadata = function (e) {
                vid2.play();
            };
        } catch (ex) {
            console.log("Failed to connect to remote media!", ex);
        }
    };

    ServerPeerConn.onicecandidate = function (event) {
        console.log("ServerPeerConn!");

    };
    ServerPeerConn.ondatachannel = function (event) {
        dataChannel = event.channel;
        setDataChannel(dataChannel);
    }
    var offerOptions = {
        // New spec states offerToReceiveAudio/Video are of type long (due to
        // having to tell how many "m" lines to generate).
        // http://w3c.github.io/webrtc-pc/#idl-def-RTCOfferAnswerOptions.
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
        iceRestart: 0,
        voiceActivityDetection: 0
    };
    //ServerPeerConn.createOffer(function (desc) {
    ServerPeerConn.createOffer(offerOptions).then(function (desc) {
        console.log('createOffer: ' + desc.sdp);

        ServerPeerConn.setLocalDescription(desc, function () {
            var sdata = {};
            sdata["command"] = "__Offer";
            sdata["desc"] = desc;
            ws_Send(sdata);
        },
        function (errorInformation) {
            console.log('setLocalDescription error: ' + errorInformation);
        });
    },
    function (error) {
        console.log(error);
    },
    offerOptions);
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
        sdata["command"] = "__UserJoin";
        var udata = {};
        udata["UserID"] = UserID;
        udata["Password"] = Password;
        sdata["udata"] = udata;
        ws_Send(sdata);

        console.log("Socket connected!");
        labe2.innerHTML = "Socket connected!";
    };

    rtc_ws.onclose = function () {
        console.log("webSocket connection has been disconnected!");
        rtc_ws = null;
    };

    rtc_ws.onmessage = function (Message) {
        var obj = JSON.parse(Message.data);
        var command = obj.command;
        switch (command) {
            case "__OnLoginSuccessful": {
                createPeerConnection();
                cursocketId = obj.socketId;
            }
            break;

            case "__OnError": {
                labe2.innerHTML = obj.info;
            }
            break;
            case "__OnSuccessAnswer": {
                if (ServerPeerConn) {
                    console.log("OnSuccessAnswer[remote]: " + obj.sdp);
                    ServerPeerConn.setRemoteDescription(
                    new nativeRTCSessionDescription({ type: "answer", sdp: obj.sdp }),
                    function () { },
                    function (errorInformation) {
                        console.log('setRemoteDescription error: ' + errorInformation);
                    });
                }
            }
            break;
            case "__OnIceCandidate": {
                if (ServerPeerConn) {
                    console.log("11111111111111111111111,OnIceCandidate[remote]: " + obj.sdp);

                    var c = new nativeRTCIceCandidate({
                        sdpMLineIndex: obj.sdp_mline_index,
                        candidate: obj.sdp
                    });
                    ServerPeerConn.addIceCandidate(c);
                }
            }
            break;
            default: {
                console.log(Message.data);
            }
        }
    };
}
