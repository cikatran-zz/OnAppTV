var mySwiper;
var myTimer;
var nums;
var signalStrength; //信号强度
var SSIDName = ''; //SSID账号
window.onload = function() {
		window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo');
		myTimer = setInterval(function(){
			window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo');
		},1000)
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
	bridge.registerHandler('HIG_GetMobileWifiInfo', function(data, responseCallback) {
		var jsonObj = JSON.parse(data);
		//判断获取得到的SSID的value值
		if(jsonObj.SSID.indexOf('STB') >= 0) {
			signalStrength = jsonObj.SignalStrength;
			SSIDName = jsonObj.SSID;
		}
	})
})
$(function() {
	nums = $.query.get("nums");
	$(".HIGContent-header").height($(window).height() * 0.25);
	$(".HIGContent-body").css({
		"width": "100%",
		"height": $(window).height() * 0.55
	})
	$(".content-body").css({
		"width": $(window).width(),
		"height": $(window).height() * 0.63
	})
	$(".body-square").css({
		height:"55%",
		width:"76%",
		background:"url(./img/blur.png) center center no-repeat",
		"background-size":"100%"
		
	})
	mySwiper = new Swiper('.swiper-container', {
		direction: "horizontal",
		pagination: '.swiper-pagination',
		height: 250, //你的slide高度
		width: $(window).width()

	});
	$(".button-a").css('background-color', '#FC355B');
	myTimer = setInterval(function() {
		//window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo');
		switch(signalStrength) {
			case 0:
				$(".imgMask").css('visibility', 'hidden');
				break;
			case 1:
				$(".imgMask").css('visibility', 'visible');
				$(".imgMask").attr('src', 'img/Wifi-Blue.png');
				break;
			case 2:
				$(".imgMask").css('visibility', 'visible');
				$(".imgMask").attr('src', 'img/wifi-3.png');
				break;
			case 3:
				$(".imgMask").css('visibility', 'visible');
				$(".imgMask").attr('src', 'img/wifi-4.png');
				break;
			default:
				$(".imgMask").css('visibility', 'hidden');
		}
	}, 1000)
	$("#Avalible").click(function() {
		//状态
		var obj = {
			"connectState": connect
		};
		var data = JSON.stringify(obj);
		window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	})
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		var thisID = this.id;
		if(thisID == "close") {
			document.location.href = "SelectDecoder.html?nums=" + nums;
		} else if(thisID == "WifiCheck") {
			var currentBtnColor = $(".button-a").css('background-color');
			if(currentBtnColor == 'rgb(252, 53, 91)') {
				window.clearInterval(myTimer);
				document.location.href = "WifiPassword.html?nums=" + nums + "&SSIDName=" + SSIDName + "&isConnect=0";

			}
		}

		if(thisID == "Install") {
			$(".HIG-Container").animate({
				"left": 0,
				 "opacity":1
			}, "fast", function() {
				$(".HIG-Container").css("display", "block");
				$(".Selector").animate({
					 "opacity":0,
				}, "normal", function() {
					$(".Selector").css("display", "none");
				})
				
			})
		} else if(thisID == "skip") {
			$("body").addClass('bg');
			connect = false;
			$(".selectcoder").animate({
				"left": 0
			}, "fast", function() {
				$(".selectcoder").css("display", "block");
				$(".Selector").animate({
					"left": -$(window).width()
				}, "fast", function() {
					$(".Selector").css("display", "none");
				})
			})
		}
	});
})