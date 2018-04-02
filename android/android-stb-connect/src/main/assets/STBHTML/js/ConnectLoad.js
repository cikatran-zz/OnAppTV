var nums;
var SSIDName = '';
var jsonObj = [];
var myTimer;
var jsonbj;
var isConnect;
window.onload = function() {

}
$(function() {
	//判断是否已经连接
	if($.query.get('isConnect')) {
		//已连接
		var times = setTimeout(function() {
			GetSatelliteList();
		}, 1000);
	} else {
		var SName = $.query.get('SSIDName').length > 4 ? $.query.get("SSIDName").substring(5, $.query.get('SSIDName').length) : '';
		nums = $.query.get('nums');
		SSIDName = SName.toLowerCase();
		//  alert($.query.get('isConnect') +'+'+SName);
		myTimer = setInterval(function() {
			GetSTBList();
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

});

function GetSatelliteList() {
	var Str = "传递给 java 的数据";
	window.WebViewJavascriptBridge.callHandler("HIG_GetSatelliteList", Str, function(responseData) {
		jsonbj = JSON.parse(responseData);
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
		}, 9000);
	});

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

function GetSTBList() {
	window.WebViewJavascriptBridge.callHandler("HIG_GetSTBList", function(responseData) {
		jsonObj = JSON.parse(responseData);
		$.map(jsonObj, function(item, index) {
			if(SSIDName.length > 0 && SSIDName == item.sTBID) {
				window.clearInterval(myTimer);
				ConnectSTB(JSON.stringify(item));
				//                  window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', JSON.stringify(item));
			}
		})
	})
}

function ConnectSTB(datas) {
	window.WebViewJavascriptBridge.callHandler("HIG_ConnectSTB", datas, function(responseData) {
		var Obj = JSON.parse(responseData);
		if(Obj.return == 1) {
			isConnect = true;
			GetSatelliteList();
		} else {
			isConnect = false;
		}
	})
}