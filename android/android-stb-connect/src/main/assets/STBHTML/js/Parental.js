var parentalGuideRating;
var connectState;
window.onload = function() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetParentalGuideRating');
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
	bridge.registerHandler('HIG_GetParentalGuideRating', function(data, responseCallback) {
		var jsonObj = JSON.parse(data);
		parentalGuideRating = jsonObj.parentalGuideRating == "" ? 0 : jsonObj.parentalGuideRating;
	})
})
$(function() {
	$(".content-body").css({
		"width": $(window).width(),
		"height": $(window).height() * 0.62
	})
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		connectState = true;
		$("body").removeClass('bg').addClass('backBg');
//		document.location.href = "Antional.html?connectState=" + connectState;
		$(".selectcoder").animate({
			"left": 0
		}, "fast", function() {
			$(".selectcoder").css("display", "block");
		})
		$(".Parental").animate({
			"left": -$(window).width()
		}, "fast", function() {
			$(".Parental").css("display", "none");
		});
	})
	//判断是否打开checkbox
	$("input[type='checkbox']").click(function() {
		var roundList = $(".round");
		for(var i = 0; i < roundList.length; i++) {
			var controls = $(roundList[i]).find('span')[0];
			if($(controls).html() == parentalGuideRating) {
				$(controls).addClass('selcted');
			}
		}
		var check = this;
		if(check.checked) {
			$(".round").on("tap", function() {
				if(check.checked) {
					for(var i = 0; i < roundList.length; i++) {
						var controls = $(roundList[i]).find('span')[0];
						$(controls).removeClass('selcted');
					}
					var controls = $(this).find("span")[0];
					$(controls).addClass('selcted');
				}
				//HIG_SetParantalGuideRating
				var parentalGuideRatingData = {
					"parentalGuideRating": $(controls).html()
				};
				var data = JSON.stringify(parentalGuideRatingData);
				window.WebViewJavascriptBridge.callHandler('HIG_SetParantalGuideRating', data);
			})
		} else {
			for(var i = 0; i < roundList.length; i++) {
				var controls = $(roundList[i]).find('span')[0];
				$(controls).removeClass('selcted');
			}
		}
	})
	$("#Avalible").click(function() {
		//状态
		var obj = {
			"connectState": connectState
		};
		var data = JSON.stringify(obj);
		window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	})
})