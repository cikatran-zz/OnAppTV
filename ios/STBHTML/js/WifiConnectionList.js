var wifiName = ''; //连接名称
var jsonObj = [];
var nums; //是否第一次连接
//连接状态
var connectStatus = false;
var times; //定时器
var time = 0; //点击事件间隔
var flag = 0;
var arrData = [];
window.onload = function() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	times = setInterval(function() {
		window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	}, 1500);
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
		//判断是否是第一次加载
		if(jsonObj.length == 0) {
			var arr = compareObject(jsonObj, JSON.parse(data));
			var squareList = $(".list ul");
			$(squareList).html('');
			loadData(arr);
		} else {
			flag += 1;
			arrData.push(data);
			if(flag % 5 == 0) {
				var getArray = getObjectFromArray(arrData);
				arrData = [];
				flag == 0;
				var del = compareObject(getArray, jsonObj);
				var arr = compareObject(jsonObj, getArray);
				loadData(arr);
				deletData(del);
			}
		}
	})
	bridge.registerHandler('HIG_ConnectSTB', function(data, responseCallback) {
		var Obj = JSON.parse(data);
		if(Obj.return == "1") {
			//连接成功
			var hrefs;
			if(nums == 'notFirst') {
				window.clearInterval(times);
				connectStatus = true;
//				 hrefs = "Antional.html?connectState=" + connectStatus;
				$(".selectcoder").animate({"left":0},"fast",function(){
					$(".selectcoder").css("display","block");
				})
				$(".STBList").animate({"left":-$(window).width()},"fast",function(){
					$(".STBList").css("display","none");
				})
			} else {
				hrefs = "ConnectLoad.html?isConnect=" + true;
			}
			mui.openWindow({
				url: hrefs,
				id: hrefs
			})
		} else {
			//连接失败
			connectStatus = false;
		}
	})
})
$(function() {
	nums = $.query.get("nums");
	//默认按钮颜色
	$("#Validate").addClass('btn_trans');
	if(nums == "notFirst") {
		$(".body-group").append('<a class="btn_trans button-a animsition-link" href="" id="skip" data-animsition-out="fade-out-left">Skip</a>');
	}
	$(".content-body").css({
		"width": $(window).width(),
		"height": $(window).height() * 0.62
	})

	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		var thisID = this.id; //判断点击按钮的ID
		if(thisID == "skip") {
			if(jsonObj.length > 0) {
				connectStatus = false;
//				 document.location.href = "Antional.html?connectState=" + connectState;
				$(".selectcoder").animate({"left":0},"fast",function(){
					$(".selectcoder").css("display","block");
				})
				$(".STBList").animate({"left":-$(window).width()},"fast",function(){
					$(".STBList").css("display","none");
				})
			}
		} else if(thisID == "Validate") {
			var currentBtnColor = $(this).css('background-color');
			if(currentBtnColor == 'rgb(252, 53, 91)') {
				for(var i = 0; i < jsonObj.length; i++) {
					if(jsonObj[i].sTBID == wifiName) {
						if(time == 0) {
							time = 3; //设置间隔时间（秒）
							//机顶盒连接
							var Str = JSON.stringify(jsonObj[i])
							window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', Str);
							setTimeout(function() {
								if(!connectStatus) {
									$.MsgBox.Alert("Warning!", "The connection failed, please reconnect");
									//关闭打开的checkbox
									var checkArray = $("input[type='checkbox']");
									for(var i = 0; i < checkArray.length; i++) {
										if(checkArray[i].checked) {
											checkArray[i].checked = false;
										}
									}
									$("#Validate").addClass('btn_trans');
								}
							}, 3000)
							var timers = setInterval(function() {
								time--;
								if(time == 0) {
									clearInterval(timers);
								}
							}, 1000);
						}
					}
				}
			}
		}
	});
	//如果没有获取到数据
	setTimeout(function() {
		if(jsonObj.length <= 0) {
			window.clearInterval(times);
			mui.openWindow({
				url: "SelectDecoder.html?nums=" + nums,
				id: "SelectDecoder.html"
			})
		}
	}, 3000)
	$("#Avalible").click(function() {
					//状态
					var obj = {
						"connectState": connectStatus
					};
					var data = JSON.stringify(obj);
					window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
				})
	
})

function ConnectClick() {
	//获取高度
	var squareHeight = $(window).height() * 0.48;
	var listHeight = $(".list").height();
	//当列表的高度大于父级div的高度时，增加滚动条
	if($('.list').height() > $(window).height() * 0.48) {
		$(".list").css({
			'height': squareHeight - 60,
			'overflow': 'auto'
		})
	}
	//获取switch
	var checklist = $("input[type='checkbox']:checked");
	if(checklist.length == 0) {
		$("#Validate").addClass('btn_trans');
	} else {
		$("#Validate").removeClass('btn_trans');
	}
	//	设置点击switch的事件
	$("input[type='checkbox']").click(function() {
		//  	判断checkbox是否关闭
		if(this.checked) {
			var wifiList = $('li');
			for(var i = 0; i < wifiList.length; i++) {
				var checkbtn = $(wifiList[i]).find('input')[0];
				checkbtn.checked = false;
			}
			this.checked = true;
			$("#Validate").removeClass('btn_trans');
			wifiName = $($(this).parent()[0]).find('label').html();
			// 	console.log(wifiName);
		} else {
			wifiName = '';
			checks = false;
			this.checked = false;
			$("#Validate").addClass('btn_trans');
			$("#Validate").attr("disabled", true);
		}
	})
}
//删除数据
function deletData(obg) {
	if(obg.length > 0) {
		var squareList = $(".list ul")[0].children;
		for(var i = 0; i < squareList.length; i++) {
			for(c in obg) {
				var ht = squareList[i].innerText;
				var tg = obg[c].sTBID;
				if(squareList[i].innerText == obg[c].sTBID) {
					jsonObj.splice(i, 1);
					$(".list ul li")[i].remove();
				}
			}
		}
	}
	if(jsonObj.length <= 0) {
		mui.openWindow({
			url: "SelectDecoder.html?nums=" + nums,
			id: "SelectDecoder.html"
		})
	}
	ConnectClick();
}

function loadData(obg) {
	var squareList = $(".list ul");
	//判断是否已经存在
	for(var i = 0; i < obg.length; i++) {
		if(!obg[i].isExist) {
			jsonObj.push(obg[i]);
			$(squareList).append('<li><label>' + obg[i].sTBID + '</label>' +
				'<input type="checkbox" id=' + obg[i].iPAddress + ' class="mui-switch mui-switch-anim" name="WifiName" />' +
				'</li>');
		}
	}
	ConnectClick();
}
//获取数组中不重复的值
function compareObject(a, b) {
	var arrCom = new Array();
	for(var i = 0; i < b.length; i++) {
		var strb = b[i];
		strb.isExist = false;
		var aSTB = strb.iPAddress;
		for(var j = 0; j < a.length; j++) {
			var stra = a[j];
			var sSTB = stra.iPAddress;
			if(aSTB == sSTB) {
				strb.isExist = true;
				break;
			}
		}
		if(!strb.isExist) {
			arrCom.push(strb);
		}
	}
	return arrCom;
}

function getObjectFromArray(arr) {
	var obj = arr[0];
	for(i in arr) {
		if(arr[i].length == 0) {
			return arr[0];
			break;
		} else {
			if(JSON.parse(arr[i]).length > JSON.parse(obj).length) {
				obj = arr[i];
			}
		}

	}
	return JSON.parse(obj);
}