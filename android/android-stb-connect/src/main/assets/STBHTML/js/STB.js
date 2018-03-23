var jsonObj;
var listindex = null;
window.onload = function() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
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
		$(".swiper-wrapper").html('');
		var listHTML = '';
		for(var i = 0; i < jsonObj.length; i++) {
			listHTML += '<div class="swiper-slide"><div class="STBName"><span>' + jsonObj[i].sTBID + '</span>';
			listHTML += '<input class="mui-switch mui-switch-anim" name="STB" type="checkbox" onclick="Switch(\'' + i + '\')">';
			listHTML += '</div></div>';
		}
		$(".swiper-wrapper").append(listHTML);
	})
	bridge.registerHandler('HIG_ConnectSTB', function(data, responseCallback) {
		var obj = JSON.parse(data);
		if(obj.return == 1) {
			window.location.href = "Antional.html";
		} else {
			alert(obj.return);
		}
	})
})
$(function() {
	$(".STBContainer-main").height($(window).height() - 120);
	var STBListheight = $(window).height() - 120 - 60;
	if($(window).height() < 350) {
		$(".STBContainer-footer").height(90);
		$(".STBContainer-main").height($(window).height() - 90);
		$(".STB_form").css("padding-top", "20px");
		STBListheight = $(window).height() - 90 - 20;
	}

	$(".STB_form").height(STBListheight);

	$(".swiper-container").height(STBListheight);
	var STBlist = new Swiper('.swiper-container', {
		direction: 'vertical',
		height: 40
	})

})

function Switch(index) {
	var list = $(".swiper-slide input[type='checkbox']");
	var check = list[index].checked;
	if(check == true) {
		for(var i = 0; i < list.length; i++) {
			if(i == index) {
				listindex = index;
				list[i].checked = true;
				$(this).prop('checked', 'checked');

			} else {
				list[i].checked = false;
				$(list[i]).removeProp('checked');
			}
		}
	} else {
		check = true;
		$(this).prop('checked', 'checked');
	}
}

function HIG_ConnectSTB() {
	var isJump = false;
	var list = $(".swiper-slide input[type='checkbox']");
	for(var i = 0; i < list.length; i++) {
		if(list[i].checked) {
			isJump = true;
		}
	}
	if(isJump == true) {
		var STBList = jsonObj[listindex];
		var STBAddr = {
			"iPAddress": STBList.iPAddress,
			"userName": "test"
		};
		var jsonString = JSON.stringify(STBAddr);

		window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', jsonString);
	} else {
		alert("Please select STB.")
	}
}