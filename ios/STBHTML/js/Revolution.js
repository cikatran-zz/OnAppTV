var timers;
var nums;
var jsonObj = [];
window.onload = function() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	timers = setInterval(function() {
		window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	}, 1000);
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
	bridge.registerHandler('HIG_GetSTBList', function(data, responseCallback) {
		jsonObj = JSON.parse(data);
		//结束定时器
		setTimeout(function() {
			window.clearInterval(timers);
			if(jsonObj.length > 0) {
				//window.location.href = "WifiConnectionList.html?nums=" + nums;
				mui.openWindow({
					url: "SelectSTB.html?nums=" + nums,
					id: "SelectSTB.html",
					show: {
						autoShow: true,
						aniShow: "slide-in-bottom",
						duartion: "2000"
					},
				})
			}
		}, 3000);
	})
})
$(function() {
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
	}, 3000);
})