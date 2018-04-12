setTimeout(function() {
	start();
}, 1.5 * 1000);

var timer;
var isScan = true;

function start() {
	return timer = setInterval(function() {
		isScan == true ? window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList') : stop();
	}, 1000 * 1);
}

function stop() {
	timer = clearInterval(timer);
	window.location.href = 'STB.html';
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
		isScan = false;
	})
})