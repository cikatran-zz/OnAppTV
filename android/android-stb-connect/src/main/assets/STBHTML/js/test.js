window.onload = function(){
// getSNYN();
   }
   $(function(){

   var times = setInterval(function() {

//    console.log("重复执行");
//    window.WebViewJavascriptBridge.registerHandler('functionInJs');
      getSNYN();
    	}, 1000);

   });
   function getSNYN(){
   var Str = "传递给 java 的数据";
     			window.WebViewJavascriptBridge.callHandler("HIG_GetSatelliteList", Str, function(responseData) {
   				setTimeout(function() {
                   			//获取top
                   			$(".body-top").empty();
                   			$(".body-top").append('<p>Software Update</p>');
                   			$(".body-middle").empty();
                   			$(".body-middle").append('<label>The software of your decoder<br/>is being updates,<br/>It will take less than 1 minute</label>');
                   		}, 3000);
                   		setTimeout(function() {
                   			$(".body-top").empty();
                   			$(".body-top").append('<p>Channels List Update</p>');
                   			$(".body-middle").empty();
                   			$(".body-middle").append('<label>The channels list is being<br />updated</label>');
                   		}, 6000);
//                   		setTimeout(function() {
//                   			//默认显示DataBase的最后一个元素
//                   			var stataModel = jsonbj[jsonbj.length - 1];
//                   			satelliteID = stataModel.satelliteID;
//                   			var carrierID = stataModel.transponderModelArr[0].carrierID;
//                   			mui.openWindow({
//                   				url: "ChannelList.html?list=" + satelliteID + "&carrierID=" + carrierID,
//                   				id: "ChannelList.html"
//                   			})
//                   			//			window.location.href = "ChannelList.html?list=" + satelliteID+"&carrierID="+carrierID;
//                   		}, 9000);
//                   	})
     			});
//   jsonbj = JSON.parse(data);

   }
    function addfvd(){
    	console.log("方法显示");
    }
       function testClick() {
           //发送消息给java代码
           var data = '发送消息给java代码全局接收';
           //第一个参数要发送的数据 第二个参数js在被回调后具体执行方法，responseData为java层回传数据
           window.WebViewJavascriptBridge.send(
               data
               , function(responseData) {
                  bridgeLog('来自Java的回传数据： ' +responseData);
               }
           );
       }

       function testClick1() {

//     window.WebViewJavascriptBridge.callHandler('submitFromWeb');
//         //调用本地java方法
//         //第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
           var data='发送消息给java代码指定接收';
           window.WebViewJavascriptBridge.callHandler(
               'submitFromWeb'
               ,data
               , function(responseData) {
                   bridgeLog('来自Java的回传数据： ' + responseData);
               }
           );
       }

       function bridgeLog(logContent) {
           document.getElementById("log_msg").innerHTML = logContent;
       }

      function setupWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if(window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	document.addEventListener('WebViewJavascriptBridgeReady',function(){
		callback(WebViewJavascriptBridge)
	},false);
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}
       //注册回调函数，第一次连接时调用 初始化函数
       setupWebViewJavascriptBridge(function(bridge) {

           bridge.init(function(message, responseCallback) {
               bridgeLog('默认接收收到来自Java数据： ' + message);
               var responseData = '默认接收收到来自Java的数据，回传数据给你';
               responseCallback(responseData);
           });

            //注册回调函数，第一次连接时调用，初始化函数
           bridge.registerHandler("functionInJs", function(data, responseCallback) {
               console.log('指定接收收到来自Java数据： ' + data);
               var responseData = '指定接收收到来自Java的数据，回传数据给你';
               console.log('来自Java的回传数据： ' + responseData);
//             responseCallback(responseData);
           });
       })