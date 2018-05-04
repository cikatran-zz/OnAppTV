var oldPIN = "";
var newPIN = "";

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
	bridge.registerHandler('HIG_CheckSTBPINCallback', function(data, responseCallback) {
		if(data) {
			mui.openWindow({
				url: "Parental.html",
				id: "Parental.html"
			})
		} else {
			$.MsgBox.Alert("Warning", data);
			newPIN = "";
			oldPIN = "";
			
			$(".enter").css("display","block");
		    $(".confirm").css("display","none");

			var newPINArray = $("#newPIN").find("u");
			for(var i = 0; i < newPINArray.length; i++) {
				$(newPINArray[i]).removeClass("selectCode");
			}
			var oldPINArray = $("#oldPIN").find("u");
			for(var i = 0; i < oldPINArray.length; i++) {
				$(oldPINArray[i]).removeClass("selectCode");
			}
		}
	})
})
$(function() {
	$(".square-content,.body-square").css({
		"height": "18%",
		"width": "76%"
	});
	$(".num-code").append('<div class="num-line"><div class="code">1</div><div class="code margin_center">2</div><div class="code side">3</div></div>' +
		'<div class="num-line"><div class="code">4</div><div class="code margin_center">5</div><div class="code side">6</div></div>' +
		'<div class="num-line"><div class="code">7</div><div class="code margin_center">8</div><div class="code side">9</div></div>' +
		'<div class="num-line"><div class="code" style="background:none"></div><div class="code margin_center">0</div><div class="code delete side"><img class="backfr" src="img/number_Delete.png"/></div></div>');

	//点击输入密码
	$(".code").on("tap", function() {
		var codeLab = this.innerText;
		var codeLable = codeLab.split("")[0];
		//删除空格
		oldPIN = oldPIN.replace(/(^\s+)|(\s+$)/g, "");
		newPIN = newPIN.replace(/(^\s+)|(\s+$)/g, "");
		//判断输入的数据是1-9
		var j = parseInt(codeLable);
		//判断输入的数字在0-9之间
		if(j >= 0 && j < 10) {
			if(oldPIN.length < 4) {
				//获取输入
				var PINArray = $("#oldPIN").find("u");
				$(PINArray[oldPIN.length]).addClass("selectCode");
				oldPIN += codeLable;
				if(oldPIN.length == 4){
				 setTimeout(function(){
						$(".enter").css("display","none");
				  $(".confirm").css("display","block");
				  newPIN = "";
					},1000);
				}
			} else if(newPIN.length < 4) {
				//获取输入
				var PINArray = $("#newPIN").find("u");
				$(PINArray[newPIN.length]).addClass("selectCode");
				newPIN += codeLable;
				if(newPIN.length == 4) {
					setTimeout(function() { 
							//判断两次输入密码是否相同
							if(oldPIN == newPIN) {
								//发送请求
								var obj = {
									"oldPIN": oldPIN,
									"newPIN": newPIN
								};
								var data = JSON.stringify(obj);
								window.WebViewJavascriptBridge.callHandler('HIG_CheckSTBPIN', data);
							} else {
								//alert("PIN input is Incorrect, Please Re-Enter");
								$.MsgBox.Alert("Warning", "Password doesn't match");
								
								newPIN = "";
								oldPIN = "";
								
								$(".enter").css("display","block");
				                $(".confirm").css("display","none");

								
								var newPINArray = $("#newPIN").find("u");
								for(var i = 0; i < newPINArray.length; i++) {
									$(newPINArray[i]).removeClass("selectCode");
								}
								var oldPINArray = $("#oldPIN").find("u");
								for(var i = 0; i < oldPINArray.length; i++) {
									$(oldPINArray[i]).removeClass("selectCode");
								}
							}
					}, 500);
				}
			}
		} else if($(this).hasClass("delete")) {
			if(oldPIN.length < 4) {
				var PINArray = $("#oldPIN").find("u");
				$(PINArray[oldPIN.length - 1]).removeClass("selectCode");
				oldPIN = oldPIN.substr(0, oldPIN.length - 1);
			} else if(oldPIN.length == 4) {
				//判断当前新密码中的长度
				if(newPIN.length > 0) {
					var PINArray = $("#newPIN").find("u");
					$(PINArray[newPIN.length - 1]).removeClass("selectCode");
					newPIN = newPIN.substr(0, newPIN.length - 1);
				} else {
					var PINArray = $("#oldPIN").find("u");
					$(PINArray[oldPIN.length - 1]).removeClass("selectCode");
					oldPIN = oldPIN.substr(0, oldPIN.length - 1);
				}
			} else if(newPIN.length <= 4) {
				var PINArray = $("#newPIN").find("u");
				$(PINArray[newPIN.length - 1]).removeClass("selectCode");
				newPIN = newPIN.substr(0, newPIN.length - 1);
			}
		}
	})
})
