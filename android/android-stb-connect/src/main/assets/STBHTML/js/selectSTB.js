var jsonObj = [];
var arrData = [];
var flag = 0;
var wifiName = ''; //连接名称
var time = 0; //点击事件间隔
var nums; //是否第一次连接
//连接状态
var connectStatus = false;
var times; //定时器
var notFoundList = []; //没有找到的机顶盒列表
var notFounfArray = [];
$(function() {
	nums = $.query.get("nums");
	$(".STB-bg").css({
		height: $(window).height(),
		width: $(window).width()
	})
	resizeNotFoundList();
	if(nums == "notFirst") {
		$(".con-foot").append('<button class="btn btn-skip" id="btn-skip" value="skip">Skip</button>');
	}

	$("#Avalible").on('tap', function() {
		//状态
		window.clearInterval(times);
		var obj = {
			"connectState": connectStatus
		};
		var data = JSON.stringify(obj);
		window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	})
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'button', function() {
		var thisID = this.id; //判断点击按钮的ID
		if(thisID == "btn-skip") {
			if(jsonObj.length > 0) {
				connectStatus = false;
				$("body").addClass('bg');
				$(".selectcoder").animate({
					"left": 0
				}, "fast", function() {
					$(".selectcoder").css("display", "block");
				})
				$(".STBList").animate({
					"left": -$(window).width()
				}, "fast", function() {
					$(".STBList").css("display", "none");
				})
			}
		} else if(thisID == "btn-conn") {
			$("body").addClass('bg');
			var currentBtnColor = $(this).css('background-color');
			if(currentBtnColor == 'rgb(252, 53, 91)') {
				for(var i = 0; i < jsonObj.length; i++) {
					if(jsonObj[i].stb.sTBID == wifiName) { //测试
						if(time == 0) {
							time = 3; //设置间隔时间（秒）
							//机顶盒连接
							var Str = JSON.stringify(jsonObj[i]);
							window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', Str, function(responseData) {
								//							var jsonString = '{"return" : "1"}';
								var Obj = JSON.parse(responseData);
								if(Obj.return == 1) {
									//连接成功
									var hrefs;
									if(nums == 'notFirst') {
										window.clearInterval(times);
										connectStatus = true;
										$(".selectcoder").animate({
											"left": 0
										}, "fast", function() {
											$(".selectcoder").css("display", "block");
										})
										$(".STBList").animate({
											"left": -$(window).width()
										}, "fast", function() {
											$(".STBList").css("display", "none");
										})
									} else {
										$("body").removeClass('bg');
										hrefs = "ConnectLoad.html?isConnect=" + true;
										mui.openWindow({
											url: hrefs,
											id: hrefs,
											show: {
												autoShow: true,
												aniShow: "slide-in-bottom",
												duartion: "2000"
											},
										});
									}

								} else {
									//连接失败
									connectStatus = false;
								}
							});
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
									$("#btn-conn").removeClass("btn-conn");
								}
							}, 6000)
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
			$("body").removeClass('bg');
			mui.openWindow({
				url: "SelectDecoder.html?nums=" + nums,
				id: "SelectDecoder.html"
			})
		}
	}, 6000)
})

function ConnectResize() {
	$(".con-body-top").css({
		height: $(window).height() * 0.32
		//height: $(window).height() * 0.56
	})
	$(".con-body-bottom").css({
		"visibility": "visible",
		height: $(window).height() * 0.24
		//height: $(window).height() * 0
	})
	$(".selectedname").css({
		width: $(".con-body-top").width() * 1.1,
		height: $(".con-body-top").height() * 0.7,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	})
	$(".selectedname>li").css({
		width: $(".con-body-top").width() * 0.8,
		"margin-left": $(".con-body-top").width() * 0.06,
	})

	$(".listul").css({
		width: $(".con-body-bottom").width() * 1.1,
		height: $(".con-body-bottom").height() * 0.60,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	})
	$(".listul>li").css({
		width: $(".con-body-bottom").width() * 0.76,
		"margin-left": $(".con-body-bottom").width() * 0.06,
	})

}

function checkWhetherConnect() {
	var list = $('.selectedname').find("li");
	var checklist = $("input[type='checkbox']:checked");
	if(checklist.length == 0) {
		$("#btn-conn").removeClass("btn-conn");
	} else {
		$("#btn-conn").addClass("btn-conn");
	}
	//获取点击的checkbox
	$("input[type='checkbox']").on('click', function() {
		//判断点击的 checkbox 是否打开
		if(this.checked) {
			$(list).each(function(index, item) {
				var check = $(item).children("input[type='checkbox']")[0];
				if(check.checked) {
					check.checked = false;
				}
			})
			this.checked = true;
			wifiName = $(this).prev().html();
			window.clearInterval(times);

			$("#btn-conn").addClass("btn-conn");
		} else {
			this.checked = false;
			$("#btn-conn").removeClass("btn-conn");
		}
	})
}

function resizeNotFoundList() {
	$(".con-body-top").css({
		//height: $(window).height() * 0.32
		height: $(window).height() * 0.53,
		"max-height": "10rem"
	})
	$(".con-body-bottom").css({
		"visibility": "hidden",
		//    height: $(window).height() * 0.24
		height: $(window).height() * 0
	})
	$(".selectedname").css({
		width: $(".con-body-top").width() * 1.1,
		height: $(".con-body-top").height() * 0.78,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	})
	$(".selectedname>li").css({
		width: $(".con-body-top").width() * 0.8,
		"margin-left": $(".con-body-top").width() * 0.06,
	})
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

window.onload = function() {
	//发送请求
	//	getSTBList();
	//	window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	times = setInterval(function() {
		getSTBList();
		getUnDisCoverStbList();
		//		window.WebViewJavascriptBridge.callHandler('HIG_GetSTBList');
	}, 2000);
}

function getSTBList() {
	var data = '发送消息给java代码指定接收';
	window.WebViewJavascriptBridge.callHandler(
		"HIG_GetSTBList",
		data,
		function(responseData) {
			var Obj = JSON.parse(responseData);
			console.log("获取数据的长度" + Obj.length);
			//判断是否是第一次加载
			if(jsonObj.length == 0) {
				var arr = compareObject([], JSON.parse(responseData));
				var squareList = $(".selectedname");
				$(squareList).html('');
				loadData(arr);
				////判断没有找到的 STB
				//if(Obj.noFoundSTBList.length > 0) {
				//ConnectResize();
				//loadNotFoundList(Obj.noFoundSTBList);
				//} else {
				//resizeNotFoundList();
				//}
			} else {
				flag += 1;
				arrData.push(JSON.parse(responseData));
				//notFounfArray.push(Obj.noFoundSTBList);
				if(flag % 2 == 0) {
					var getArray = getObjectFromArray(arrData);
					//var getNotArray = getCutObjectFromArray(notFounfArray);
					//notFounfArray = [];
					arrData = [];
					flag == 0;
					var del = compareObject(getArray, jsonObj);
					var arr = compareObject(jsonObj, getArray);
					//var delNot = compareObjectForNot(getNotArray, notFoundList);
					//var arrNot = compareObjectForNot(notFoundList, getNotArray);
					loadData(arr);
					//					deletData(del);
					//loadNotFoundList(arrNot);
					//delNotFoundList(delNot);
				}
			}
		})
}

function getUnDisCoverStbList() {
	var data = '发送消息给java代码指定接收';
	window.WebViewJavascriptBridge.callHandler(
		"HIG_UndiscoveredSTBList",
		data,
		function(responseData) {
			//判断是否是第一次加载
			//if(notFoundList.length == 0) {
			//var arr = compareObjectForNot([], JSON.parse(data));
			//loadNotFoundList(arr);
			//} else {
			//                                                    flag += 1;
			//arrData.push(JSON.parse(data));
			notFounfArray.push(JSON.parse(data));
			//                                                    if(flag % 1 == 0) {
			//var getArray = getObjectFromArray(arrData);
			var getNotArray = getCutObjectFromArray(notFounfArray);
			notFounfArray = [];
			//arrData = [];
			//                                                    flag == 0;
			//var del = compareObject(getArray, jsonObj);
			//var arr = compareObject(jsonObj, getArray);
			//var delNot = compareObjectForNot(getNotArray, notFoundList);
			//var arrNot = compareObjectForNot(notFoundList, getNotArray);
			//loadData(arr);
			//deletData(del);
			loadNotFoundList(getNotArray);
			//delNotFoundList(delNot);
			//                                                    }
			//}
		})
}

//setupWebViewJavascriptBridge(function(bridge) {
//	bridge.registerHandler('HIG_GetSTBList', function(data, responseCallback) {
//		var Obj = JSON.parse(data);
//		//判断是否是第一次加载
//		if(jsonObj.length == 0) {
//			var arr = compareObject([], JSON.parse(data));
//			var squareList = $(".selectedname");
//			$(squareList).html('');
//			loadData(arr);
//			////判断没有找到的 STB
//			//if(Obj.noFoundSTBList.length > 0) {
//			//ConnectResize();
//			//loadNotFoundList(Obj.noFoundSTBList);
//			//} else {
//			//resizeNotFoundList();
//			//}
//		} else {
//			flag += 1;
//			arrData.push(JSON.parse(data));
//			//notFounfArray.push(Obj.noFoundSTBList);
//			if(flag % 5 == 0) {
//				var getArray = getObjectFromArray(arrData);
//				//var getNotArray = getCutObjectFromArray(notFounfArray);
//				//notFounfArray = [];
//				arrData = [];
//				flag == 0;
//				var del = compareObject(getArray, jsonObj);
//				var arr = compareObject(jsonObj, getArray);
//				//var delNot = compareObjectForNot(getNotArray, notFoundList);
//				//var arrNot = compareObjectForNot(notFoundList, getNotArray);
//				loadData(arr);
//				deletData(del);
//				//loadNotFoundList(arrNot);
//				//delNotFoundList(delNot);
//			}
//		}
//	})
//	//HIG_UndiscoveredSTBList
//	bridge.registerHandler('HIG_UndiscoveredSTBList', function(data, responseCallback) {
//		//判断是否是第一次加载
//		//if(notFoundList.length == 0) {
//		//var arr = compareObjectForNot([], JSON.parse(data));
//		//loadNotFoundList(arr);
//		//} else {
//		//                                                    flag += 1;
//		//arrData.push(JSON.parse(data));
//		notFounfArray.push(JSON.parse(data));
//		//                                                    if(flag % 1 == 0) {
//		//var getArray = getObjectFromArray(arrData);
//		var getNotArray = getCutObjectFromArray(notFounfArray);
//		notFounfArray = [];
//		//arrData = [];
//		//                                                    flag == 0;
//		//var del = compareObject(getArray, jsonObj);
//		//var arr = compareObject(jsonObj, getArray);
//		//var delNot = compareObjectForNot(getNotArray, notFoundList);
//		//var arrNot = compareObjectForNot(notFoundList, getNotArray);
//		//loadData(arr);
//		//deletData(del);
//		loadNotFoundList(getNotArray);
//		//delNotFoundList(delNot);
//		//                                                    }
//		//}
//	})
//	bridge.registerHandler('HIG_ConnectSTB', function(data, responseCallback) {
//		var Obj = JSON.parse(data);
//		if(Obj.return == "1") {
//			//连接成功
//			var hrefs;
//			if(nums == 'notFirst') {
//				window.clearInterval(times);
//				connectStatus = true;
//				$(".selectcoder").animate({
//					"left": 0
//				}, "fast", function() {
//					$(".selectcoder").css("display", "block");
//				})
//				$(".STBList").animate({
//					"left": -$(window).width()
//				}, "fast", function() {
//					$(".STBList").css("display", "none");
//				})
//			} else {
//				$("body").removeClass('bg');
//				hrefs = "ConnectLoad.html?isConnect=" + true;
//			}
//			mui.openWindow({
//				url: hrefs,
//				id: hrefs
//			})
//		} else {
//			//连接失败
//			connectStatus = false;
//		}
//	})
//})

function loadNotFoundList(data) {
	notFoundList = [];
	$(".listul").html("");
	//获取已经找到的STB列表
	var squareList = $(".selectedname").find("li");
	var isFound = false;
	if(data.length == 0) {
		resizeNotFoundList();
	} else {
		$(data).each(function(index, model) {
			$(squareList).each(function(index, item) {
				var stbName = $(item).find('span')[0].innerHTML;
				if(model == stbName) {
					isFound = false;
					return false;
				} else {
					isFound = true;
					return isFound;
				}
			})
			if(isFound) {
				notFoundList.push(model);
				$(".listul").append('<li><span class="stb-name">' + model + '</span></li>');
			}
			ConnectResize();
		})
		if($(".listul").html() == "" || $(".listul").html() == null || $(".listul").html().length == 0) {
			resizeNotFoundList();
		} else {
			ConnectResize();
		}
	}
}

function delNotFoundList(arr) {
	if(arr.length > 0) {
		var squareList = $(".listul")[0].children;
		for(var i = 0; i < squareList.length; i++) {
			for(c in arr) {
				var ht = squareList[i].innerText;
				var tg = arr[c];
				if(squareList[i].innerText == arr[c]) {
					notFoundList.splice(i, 1);
					$(".listul li")[i].remove();
				}
			}
		}
	}
	checkWhetherConnect();
	if(notFoundList.length == 0) {
		resizeNotFoundList();
	} else {
		ConnectResize();
	}
}

function loadData(obg) {
	var squareList = $(".selectedname");
	//判断是否已经存在
	for(var i = 0; i < obg.length; i++) {
		if(!obg[i].isExist) {
			jsonObj.push(obg[i]);
			$(squareList).append('<li><span class="stb-name">' + obg[i].stb.sTBID + '</span>' +
				'<input type="checkbox" id=' + obg[i].stb.iPAddress + ' class="mui-switch mui-switch-anim dire" name="WifiName" />' + '</li>');
		}
	}
	checkWhetherConnect();
	if(notFoundList.length == 0) {
		resizeNotFoundList();
	} else {
		ConnectResize();
	}

}

function deletData(obg) {
	if(obg.length > 0) {
		var squareList = $(".selectedname")[0].children;
		for(var i = 0; i < squareList.length; i++) {
			for(c in obg) {
				var ht = squareList[i].innerText;
				var tg = obg[c].stb.sTBID;
				if(squareList[i].innerText == obg[c].stb.sTBID) {
					jsonObj.splice(i, 1);
					$(".selectedname li")[i].remove();
				}
			}
		}
	}
	//	if(jsonObj.length <= 0) {
	//		window.clearInterval(times);
	//		$("body").removeClass('bg');
	//		mui.openWindow({
	//			url: "SelectDecoder.html?nums=" + nums,
	//			id: "SelectDecoder.html"
	//		})
	//	}
	checkWhetherConnect();
	if(notFoundList.length == 0) {
		resizeNotFoundList();
	} else {
		ConnectResize();
	}
}
//获取数组中不重复的值
function compareObject(a, b) {
	var arrCom = new Array();
	for(var i = 0; i < b.length; i++) {
		var strb = b[i];
		strb.isExist = false;
		var aSTB = strb.stb.iPAddress;
		for(var j = 0; j < a.length; j++) {
			var stra = a[j];
			var sSTB = stra.stb.iPAddress;
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

function compareObjectForNot(a, b) {
	var arrCom = new Array();
	for(var i = 0; i < b.length; i++) {
		var strb = b[i];
		strb.isExist = false;
		var aSTB = strb
		for(var j = 0; j < a.length; j++) {
			var stra = a[j];
			var sSTB = stra;
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
			return arr[i];
			break;
		} else {
			if(arr[i].length > obj.length) {
				obj = arr[i];
			}
		}
	}
	return obj;
}

function getCutObjectFromArray(arr) {
	var obj = arr[0];
	for(i in arr) {
		if(arr[i].length == 0) {
			return arr[i];
			break;
		} else {
			if(arr[i].length < obj.length) {
				obj = arr[i];
			}
		}
	}
	return obj;
}