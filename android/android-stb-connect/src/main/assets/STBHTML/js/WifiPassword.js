var SSIDName = '';
var nums;
var isDisplay = true;
var MobileTimer;
var WlanTimer;
var jsonObjs;
window.onload = function() {
	MobileTimer = setInterval(function() {
		getMobileWifiInfo();
	}, 3000)
	//	window.WebViewJavascriptBridge.callHandler('HIG_STBWlanAP');
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
	//	bridge.registerHandler('HIG_STBWlanAP', function(data, responseCallback) {
	//		
	//	})
	//	bridge.registerHandler('HIG_GetMobileWifiInfo', function(data, responseCallback) {
	//		
	//	})
})

function addListener(element, e, fn) {
	if(element.addEventListener) {
		element.addEventListener(e, fn, false);
	} else {
		element.attachEvents("on" + e, fn);
	}
}

$(function() {

	var showPWD;
	//需要传递的参数
	nums = $.query.get("nums");
	SSIDName = $.query.get('SSIDName');
	$("#CName").html(SSIDName.length > 4 ? SSIDName.substring(4, SSIDName.length) : '');
	//点击显示密码
	$("#ShowPassword").on('click', function() {
		var cd = this;
		if(this.checked) {
			showPWD = true;
			myinput.setAttribute('type', "text");
		} else {
			showPWD = false;
			myinput.setAttribute('type', "password");
		}
	})
	var myinput = document.getElementById("Pwd");
	addListener(myinput, "click", function(el) {
		myinput.setAttribute("type", "password");
		if(showPWD) {
			myinput.setAttribute("type", "text");
		}
		myinput.placeholder = "PASSWORD";
		myinput.value = '';
	})
	//点击按钮跳转
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		var thisID = this.id;
		//监听软键盘是否收起
		if($(":focus").length != 0) {
			document.activeElement.blur();
		} else {
			if(thisID == "close") {
				//关闭按钮	
				window.history.back(-1);
			} else if(thisID == "ChangeWifi") {
				//Change wifi

			} else if(thisID == "Validate") {
				//验证密码
				var wifi = $("#wifiName").val();
				var pwd = $("#Pwd").val();
				if(wifi == "" || pwd == "") {
					$.MsgBox.Alert('Warning', 'Enter Error');
				} else {
					isDisplay = true

					var wifiCheckData = {
						"SSID": wifi,
						"Password": pwd
					};
					var data = JSON.stringify(wifiCheckData);
					clearInterval(WlanTimer);
					WlanTimer = setInterval(function() {
						console.log("Wlan" + data);
						HIG_STBWlanAP(data);
					}, 2000);
					setTimeout(function() {
						alert("Error");
						clearInterval(WlanTimer);
						clearInterval(MobileTimer);
					}, 25000);
				}
			}
		}

	});
})

function HIG_STBWlanAP(data) {
	window.WebViewJavascriptBridge.callHandler('HIG_STBWlanAP', data, function(responseData) {
		console.log("HIG_STBWlanAP" + responseData);
	     jsonObjs = JSON.parse(responseData);
		if(jsonObjs.return == 1) {
			clearInterval(WlanTimer);
			clearInterval(MobileTimer);
			mui.openWindow({
				url: "ConnectLoad.html?nums=" + nums + "&SSIDName=" + SSIDName,
				id: "ConnectLoad.html",
			})
		} else {
			if(isDisplay == true) {
				isDisplay = false
			}
		}
	});
}

function getMobileWifiInfo() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo', " ", function(responseData) {
		var jsonObj = JSON.parse(responseData);
		//判断获取得到的SSID的value值
		if(jsonObj.SSID.indexOf('STB') >= 0) {
			//			signalStrength = jsonObj.SignalStrength;
			SSIDName = jsonObj.SSID;
			$("#CName").html(SSIDName.length > 4 ? SSIDName.substring(4, SSIDName.length) : '');
		} else {
			$("#CName").html('');
		}
	});
}

function CheckPassWord1(password) { //密码必须包含数字和字母
	var str = password;
	if(str == null || str.length < 8) {
		return false;
	}
	var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
	if(reg.test(str))
		return true;
}

function CheckPassWord(password) { //必须为字母加数字且长度不小于8位
	var str = password;
	if(str == null || str.length < 8) {
		return false;
	}
	var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
	if(!reg1.test(str)) {
		return false;
	}
	var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
	if(reg.test(str)) {
		return true;
	} else {
		return false;
	}
}