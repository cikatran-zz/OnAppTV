var timers;
var nums;
var jsonObj = [];
window.onload = function() {
	//	 var data='发送消息给java代码指定接收';
	//	  window.WebViewJavascriptBridge.callHandler(
	//             'HIG_GetSTBList'
	//             ,data
	//             , function(responseData) {
	//             	$.MsgBox.Alert("Warinin","HIG_GetSTBList" + responseData);
	////                 bridgeLog('来自Java的回传数据： ' + responseData);
	//             }
	//         );

	//	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList',{'param': "data"},function(responseData){
	//		$.MsgBox.Alert("Warinin","regsiterHandler" + responseData);
	//		
	//	});
		timers = setInterval(function() {
			clicktoSend();
//			window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
		}, 2000);

}

function setupWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if(window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	document.addEventListener('WebViewJavascriptBridgeReady', function() {
		callback(WebViewJavascriptBridge)
	}, false);
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}

$(function() {
	//	$.MsgBox.Alert("Warinin","HIG_GetSTBList alert");	
	if($.query.get("nums") == "") {
		nums = "notFirst";
	} else {
		nums = $.query.get("nums");
	}
	//结束定时器
	setTimeout(function() {
		window.clearInterval(timers);
		var hrefs;
		if(jsonObj.length > 0) {
			hrefs = "SelectSTB.html?nums=" + nums;
		} else {
			hrefs = "SelectDecoder.html?nums=" + nums;
		}
				mui.openWindow({
					url: hrefs,
					id: hrefs,
					show: {
						autoShow: true,
						aniShow: "slide-in-bottom",
						duartion: "2000"
					},
				});
	}, 6000);
})

function clicktoSend() {
var data = '发送消息给java代码指定接收';
	window.WebViewJavascriptBridge.callHandler(
		"HIG_GetSTBList",
		data,
		function(responseData) {
			jsonObj = JSON.parse(responseData);
			//结束定时器
			setTimeout(function() {
				window.clearInterval(timers);
				if(jsonObj.length > 0) {
//					window.location.href = "WifiConnectionList.html?nums=" + nums;
					mui.openWindow({
						url: "SelectSTB.html?nums=" + nums,
						id: "SelectSTB.html",
					})
				}
			}, 6000);
		}
	);
}