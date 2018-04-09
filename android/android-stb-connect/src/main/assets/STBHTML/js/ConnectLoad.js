var nums;
var SSIDName = '';
var jsonObj = [];
var myTimer;
var jsonbj;
var isConnect;
window.onload = function() {
	//	window.WebViewJavascriptBridge.callHandler('Search');
	//	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
}

function setupWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if(window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}
setupWebViewJavascriptBridge(function(bridge) {
	bridge.registerHandler('HIG_GetSatelliteList', function(data, responseCallback) {
		jsonbj = JSON.parse(data);
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
		setTimeout(function() {
			//默认显示DataBase的最后一个元素
			var stataModel = jsonbj[jsonbj.length - 1];
			satelliteID = stataModel.satelliteID;
			var carrierID = stataModel.transponderModelArr[0].carrierID;
			mui.openWindow({
				url: "ChannelList.html?list=" + satelliteID + "&carrierID=" + carrierID,
				id: "ChannelList.html"
			})
			//			window.location.href = "ChannelList.html?list=" + satelliteID+"&carrierID="+carrierID;
		}, 9000);
	})
	bridge.registerHandler("HIG_GetSTBList", function(data, responseCallback) {
		jsonObj = JSON.parse(data);
		$.map(jsonObj, function(item, index) {
			if(SSIDName.length > 0 && SSIDName == item.stb.sTBID) {
				window.clearInterval(myTimer);
				window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', JSON.stringify(item));
			}
		})
	})
	bridge.registerHandler("HIG_ConnectSTB", function(data, responseCallback) {
		var Obj = JSON.parse(data);
		if(Obj.return == 1) {
			isConnect = true;
			//window.clearInterval(myTimer);
			window.WebViewJavascriptBridge.callHandler('Search');
		} else {
			isConnect = false;
			//$.MsgBox.Alert('Warning',Obj.return);
		}
	})

})
$(function() {
	//判断是否已经连接
	if($.query.get('isConnect')) {
		//已连接
		window.WebViewJavascriptBridge.callHandler('Search');
	} else {
		var SName = $.query.get('SSIDName').length > 4 ? $.query.get("SSIDName").substring(4, $.query.get('SSIDName').length) : '';
		nums = $.query.get('nums');
		SSIDName = SName.toLowerCase();
		//	 alert($.query.get('isConnect') +'+'+SName);
		myTimer = setInterval(function() {
			//window.WebViewJavascriptBridge.callHandler('Search');
			window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
		}, 1500);
	}
	setTimeout(function() {
		window.clearInterval(myTimer);
		isConnect = false;
		if(isConnect == false) {
			alert("WIFI account or password is wrong")
			window.history.back(-2);
		}
	}, 35 * 1000);

})