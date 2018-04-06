var infoTimer;
var STBList = [];
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
var SatelliteList;
var satelliteID;
var carrierID;
var SSIDName = "";
var dataSourceLowLoF = [5150, 5750, 9750];
var dataSourceHightLOF = [10600, 10750, 11300, 11475];
var lNBTypeArr = [dataSourceLowLoF, dataSourceHightLOF];
//var lNBPowerArr = ["Off", "13V", "18V", "14V", "19V", "Auto"];
var lNBValueArr = ["OFF", "ON", "AUTO"];
var diSEqC10Arr = ["None"];
for(var i = 1; i <= 4; i++) {
	diSEqC10Arr.push("LNB" + i);
}
var diSEqC11Arr = ["None"];
for(var i = 1; i <= 16; i++) {
	diSEqC11Arr.push("LNB" + i);
}
var listArray = [diSEqC10Arr, diSEqC11Arr, lNBTypeArr, lNBValueArr];
var nameList = ["diSEqC10", "diSEqC11", ["lowLOF", "highLOF"], "lNBValue", "transponderModelArr"];
var StateModal;
var lowIndex;
var highIndex;
var parentalGuideRating = 0;
var oldPIN = "";
var newPIN = "";
var signalStrength; //信号强度
var mobileTimer;
var myTimer;
var WlanTimer;
var wlanConnectTimer;
var isDisplay = false;
$(function() {
	$(".STB-bg").css({
		height: $(window).height(),
		width: $(window).width()
	});
	resizeNotFoundList();
	if(nums == "notFirst") {
		$(".con-foot").append('<button class="btn-stb btn-skip" id="btn-skip" value="skip">Skip</button>');
	}
	//弹出窗口
	$("#faceBookLogin").click(function() {
		$("#facebookModal").modal({
			keyboard: true
		});
		//增加一层遮罩效果
		$("#facebookModal").before('<div class="mask"></div>');
	});
	$("#close-connect").click(function() {
		$(".stb-wifiConnect").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	});
	$("#close-wifi").click(function() {
		$(".stb-wifiPwd").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	});
	$("#Avalible").on('click', function() {
		//状态
		window.clearInterval(times);
		var obj = {
			"connectState": connectStatus
		};
		var data = JSON.stringify(obj);
		window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	});
	$("input[type='text']" || "input[type='password']").on('focus', function() {
		var _this = this;
		setTimeout(function() {
			_this.scrollIntoView(true);
			_this.scrollIntoViewIfNeeded();
		}, 200);
	});
	$("#btn-skip").click(function() {
		if(jsonObj.length > 0) {
			connectStatus = false;
			$("body").addClass('bg');
			$(".stb-selectSTB").addClass("hide-section");
			$(".stb-Geographc").removeClass("hide-section");
		}
	});
	$("#Next").click(function() {
		$(".stb-channelList").addClass("hide-section");
		$(".stb-PIN").removeClass("hide-section");
		creatSTBPIN();
	});
	$("#Next-conn").click(function() {
		$(".stb-parental").addClass("hide-section");
		$(".stb-Geographc").removeClass("hide-section");
	});
	$("#btn-conn").click(function() {
		$("body").addClass('bg');
		var currentBtnColor = $(this).css('background-color');
		if(currentBtnColor == 'rgb(252, 53, 91)') {
			for(var i = 0; i < jsonObj.length; i++) {
				if(jsonObj[i].stb.sTBID == wifiName) { //测试
					if(time == 0) {
						time = 3; //设置间隔时间（秒）
						//机顶盒连接
						var Str = JSON.stringify(jsonObj[i]);
						connectSTB(Str);
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
						}, 6000);
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
	});
	$("#Install").click(function() {
		getMobileSignal();
		mobileTimer = setInterval(function() {
			getMobileInfo();
		}, 1500);
		$(".stb-selectDocoder").addClass("hide-section");
		$(".stb-wifiConnect").removeClass("hide-section");
	});
	$("#skip").click(function() {
		connectStatus = false;
		$("body").addClass("bg");
		$(".stb-selectDocoder").addClass("hide-section");
		$(".stb-Geographc").removeClass("hide-section");
	});
	$("#WifiCheck").click(function() {
		var currentBtnColor = $(".wifi-btn").css('background-color');
		if(currentBtnColor == 'rgb(252, 53, 91)') {
			clearInterval(myTimer);
			$(".stb-wifiConnect").addClass("hide-section");
			$(".stb-wifiPwd").removeClass("hide-section");
			wifiConnect();
		}
	});
	$("#wifi-connect").click(function() {
		//验证密码
		var wifi = $("#wifiName").val();
		var pwd = $("#Pwd").val();
		if(wifi == "" || pwd == "") {
			$.MsgBox.Alert('Warning', 'Enter Error');
		} else {
			var wifiCheckData = {
				"SSID": wifi,
				"Password": pwd
			};
			var wifiData = JSON.stringify(wifiCheckData);
			clearInterval(mobileTimer);
			WlanTimer = setInterval(function() {
				HIG_STBWlanAP(wifiData);
			}, 2000);
			setTimeout(function() {
				window.clearInterval(wlanConnectTimer);
				if(connectStatus == false) {
					clearInterval(WlanTimer);
					$.MsgBox.Alert("Warning", "WIFI account or password is wrong");
					$(".stb-connectLoad").addClass("hide-section");
					$(".stb-wifiPwd").removeClass("hide-section");
				}
			}, 35 * 1000);
		}
	});
	$(".num-code").append('<tr class="num-line"><td class="code">1</td><td class="code margin_center">2</td><td class="code side">3</td></tr>' +
		'<tr class="num-line"><td class="code">4</td><td class="code margin_center">5</td><td class="code side">6</td></tr>' +
		'<tr class="num-line"><td class="code">7</td><td class="code margin_center">8</td><td class="code side">9</td></tr>' +
		'<tr class="num-line"><td class="code" style="background:none"></td><td class="code margin_center">0</td><td class="code delete side"><img class="backfr" src="img/number_Delete.png"/></td></tr>');
	//点击输入密码
	$(".code").on("click", function() {
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
				if(oldPIN.length == 4) {
					setTimeout(function() {
						$(".enter").css("display", "none");
						$(".confirm").css("display", "block");
						newPIN = "";
					}, 1000);
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
							checkSTBPIN(data);
						} else {
							//alert("PIN input is Incorrect, Please Re-Enter");
							$.MsgBox.Alert("Warning", "Password doesn't match");
							newPIN = "";
							oldPIN = "";
							$(".enter").css("display", "block");
							$(".confirm").css("display", "none");
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
	});
	var lilist = $(".channel li");
	$(".btn-left").on("click", function() {
		var lableTitle = $(this).parent().prev()[0];
		var index = 0;
		var lowLOF = StateModal.lowLOF;
		var highLOF = StateModal.highLOF;
		for(var i = 0; i < lilist.length; i++) {
			var channelLable = $(lilist[i]).find("label")[1];
			var title = $(lilist[i].children[0]).html();
			if(lableTitle.innerHTML == title) {
				if(i == 2) {
					for(var d = 0; d < listArray[i].length; d++) {
						var ind = listArray[i][d].indexOf(lowLOF);
						ind--;
						if(ind != lowIndex - 1) {
							if(ind < 0) {
								ind = listArray[i][d].length - 1;
							} else if(ind == listArray[i][d].length) {
								ind = 0;
							}
							lowLOF = listArray[i][d][ind];
							highLOF = StateModal.highLOF;
							$(channelLable).html(lowLOF + "/" + highLOF);
							StateModal.lowLOF = lowLOF;
							StateModal.highLOF = highLOF;
							break;
						} else {
							d++;
							var ind2 = listArray[i][d].indexOf(StateModal.highLOF);
							ind2--;
							if(highIndex - 1 != ind2) {
								if(ind2 < 0) {
									ind2 = listArray[i][d].length - 1;
								} else if(ind2 <= listArray[i][d].length) {
									ind2 == 0;
								}
								highLOF = listArray[i][d][ind2];
								lowLOF = StateModal.lowLOF;
								$(channelLable).html(lowLOF + "/" + highLOF);
								StateModal.lowLOF = lowLOF;
								StateModal.highLOF = highLOF;
								break;
							} else {
								ind2 = ind2 < 0 ? listArray[i][d].length - 1 : ind2;
								highLOF = listArray[i][d][ind2];
								d--;
								ind = ind < 0 ? listArray[i][d].length - 1 : ind;
								lowLOF = listArray[i][d][ind];
								$(channelLable).html(lowLOF + "/" + highLOF);
								StateModal.lowLOF = lowLOF;
								StateModal.highLOF = highLOF;
								break;
							}
						}
					}
				} else if(i == lilist.length - 1) {
					$(channelLable).html(listArray[i][0].frequency + "/" + listArray[i][0].symbolRate);
					StateModal.transponderModelArr[0].frequency = listArray[i][0].frequency;
					StateModal.transponderModelArr[0].symbolRate = listArray[i][0].symbolRate;
				} else {
					for(var j = 0; j < listArray[i].length; j++) {
						if(listArray[i][j] == $(channelLable).html()) {
							index = j;
						}
					}
					index--;
					if(index < 0) {
						index = listArray[i].length - 1;
					}
					StateModal[nameList[i]] = index;
					$(channelLable).html(listArray[i][index]);
					//					StateModal[nameList[i]] = listArray[i][index];
				}
			}
		}
		var data = JSON.stringify(StateModal);
		setSatelliteParam(data);
	});
	$(".btn-right").on("click", function() {
		var lableTitle = $(this).parent().prev()[0];
		var index = 0;
		var lowLOF = StateModal.lowLOF;
		var highLOF = StateModal.highLOF;
		for(var i = 0; i < lilist.length; i++) {
			var title = $(lilist[i].children[0]).html();
			var channelLable = $(lilist[i]).find("label")[1];
			if(lableTitle.innerHTML == title) {
				if(i == 2) {
					for(var d = 0; d < listArray[i].length; d++) {
						var ind = listArray[i][d].indexOf(lowLOF);
						ind++;
						if(ind != lowIndex + 1) {
							if(ind < 0) {
								ind = listArray[i][d].length - 1;
							} else if(ind >= listArray[i][d].length) {
								ind = 0;
							}
							lowLOF = listArray[i][d][ind];
							highLOF = StateModal.highLOF;
							$(channelLable).html(lowLOF + "/" + highLOF);
							StateModal.lowLOF = lowLOF;
							StateModal.highLOF = highLOF;
							break;
						} else {
							d++;
							var ind2 = listArray[i][d].indexOf(highLOF);
							ind2++;
							if(highIndex + 1 != ind2) {
								if(ind2 < 0) {
									ind2 = listArray[i][d].length - 1;
								} else if(ind2 >= listArray[i][d].length) {
									ind2 = 0;
								}
								highLOF = listArray[i][d][ind2];
								lowLOF = StateModal.lowLOF;
								$(channelLable).html(lowLOF + "/" + highLOF);
								StateModal.lowLOF = lowLOF;
								StateModal.highLOF = highLOF;
								break;
							} else {
								ind2 = ind2 >= listArray[i][d].length ? 0 : ind2;
								highLOF = listArray[i][d][ind2];
								d--;
								ind = ind >= listArray[i][d].length ? 0 : ind;
								lowLOF = listArray[i][d][ind];
								$(channelLable).html(lowLOF + "/" + highLOF);
								StateModal.lowLOF = lowLOF;
								StateModal.highLOF = highLOF;
								break;
							}
						}

					}
				} else if(i == lilist.length - 1) {
					//			nameLable = stateModel[nameList[i]];
					$(channelLable).html(listArray[i][0].frequency + "/" + listArray[i][0].symbolRate);
					//			listLab = listArray[i][nameLable];
				} else {
					for(var j = 0; j < listArray[i].length; j++) {
						if(listArray[i][j] == $(channelLable).html()) {
							index = j;
						}
					}
					index++;
					if(index == listArray[i].length) {
						index = 0;
					}
					//	var stateModel = data[data.length - 1];
					StateModal[nameList[i]] = index;
					$(channelLable).html(listArray[i][index]);
				}
			}

		}
		var data = JSON.stringify(StateModal);
		setSatelliteParam(data);
	});
});

function addListener(element, e, fn) {
	if(element.addEventListener) {
		element.addEventListener(e, fn, false);
	} else {
		element.attachEvents("on" + e, fn);
	}
}

function stbListInfo() {
	revolutionTimer();
	infoTimer = setInterval(function() {
		getUnDisCoverStbLists();
		var data = '发送消息给java代码指定接收';
		window.WebViewJavascriptBridge.callHandler(
			"HIG_GetSTBList",
			data,
			function(responseData) {
				STBList = JSON.parse(responseData);
				if(jsonObj.length > 0) {
					flag += 1;
					arrData.push(STBList);
					if(flag % 2 == 0) {
						var getArray = getObjectFromArray(arrData);
						arrData = [];
						flag == 0;
						var del = compareObject(getArray, jsonObj);
						var arr = compareObject(jsonObj, getArray);
						loadData(arr);
					}
				}
			});
	}, 3000);
}

function revolutionTimer() {
	setTimeout(function() {
		if(STBList.length <= 0) {
			$(".stb-revolution").addClass("hide-section");
			$(".stb-selectDocoder").removeClass("hide-section");
			clearInterval(infoTimer);
		} else {
			$(".stb-revolution").addClass("hide-section");
			$(".stb-selectSTB").removeClass("hide-section");
			var Obj = STBList;
			//判断是否是第一次加载
			if(jsonObj.length == 0) {
				var arr = compareObject([], STBList);
				var squareList = $(".selectedname");
				$(squareList).html('');
				loadData(arr);
				//启动定时器
			}
		}
	}, 6000);
	setTimeout(function() {

		if(jsonObj.length <= 0) {
			if($(".stb-selectSTB").css("display") != "none") {
				clearInterval(infoTimer);
				$("body").removeClass('bg');
				$(".stb-selectSTB").addClass("hide-section");
				$(".stb-selectDocoder").removeClass("hide-section");
			}
		}
	}, 12000);
}

function getUnDisCoverStbLists() {
	var data = '发送消息给java代码指定接收';
	window.WebViewJavascriptBridge.callHandler(
		"HIG_UndiscoveredSTBList",
		data,
		function(responseData) {
			notFounfArray.push(JSON.parse(responseData));
			var getNotArray = getCutObjectFromArray(notFounfArray);
			notFounfArray = [];
			loadNotFoundList(getNotArray);
		});
}

function loadNotFoundList(data) {
	console.log(data.length);
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
			});
			if(isFound) {
				notFoundList.push(model);
				$(".listul").append('<li><span class="stb-name">' + model + '</span></li>');
			}
			ConnectResize();
		});
		if($(".listul").html() == "" || $(".listul").html() == null || $(".listul").html().length == 0) {
			resizeNotFoundList();
		} else {
			ConnectResize();
		}
	}
}

function connectSTB(data) {
	window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', data, function(responseData) {
		var Obj = JSON.parse(responseData);
		if(Obj.return == 1) {
			window.clearInterval(infoTimer);
			//连接成功
			var hrefs;
			connectStatus = true;
			if(nums == 'notFirst') {
				$("body").addClass("bg");
				$(".stb-selectSTB").addClass("hide-section");
				$(".stb-Geographc").removeClass("hide-section");
			} else {
				$("body").removeClass('bg');
				$(".stb-selectSTB").addClass("hide-section");
				$(".stb-connectLoad").removeClass("hide-section");
				ConnectLoad();
			}
		} else {
			//连接失败
			connectStatus = false;
		}
	});
}

function ConnectResize() {
	$(".con-body-top").css({
		height: $(window).height() * 0.32
		//height: $(window).height() * 0.56
	});
	$(".con-body-bottom").css({
		"visibility": "visible",
		height: $(window).height() * 0.24
		//height: $(window).height() * 0
	});
	$(".selectedname").css({
		width: $(".con-body-top").width() * 1.1,
		height: $(".con-body-top").height() * 0.7,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	});
	$(".selectedname>li").css({
		width: $(".con-body-top").width() * 0.8,
		"margin-left": $(".con-body-top").width() * 0.06,
	});

	$(".listul").css({
		width: $(".con-body-bottom").width() * 1.1,
		height: $(".con-body-bottom").height() * 0.60,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	});
	$(".listul>li").css({
		width: $(".con-body-bottom").width() * 0.76,
		"margin-left": $(".con-body-bottom").width() * 0.06,
	});

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
			});
			this.checked = true;
			wifiName = $(this).prev().html();
			window.clearInterval(infoTimer);

			$("#btn-conn").addClass("btn-conn");
		} else {
			this.checked = false;
			$("#btn-conn").removeClass("btn-conn");
		}
	});
}

function resizeNotFoundList() {
	$(".con-body-top").css({
		//height: $(window).height() * 0.32
		height: $(window).height() * 0.53,
		"max-height": "10rem"
	});
	$(".con-body-bottom").css({
		"visibility": "hidden",
		//    height: $(window).height() * 0.24
		height: $(window).height() * 0
	});
	$(".selectedname").css({
		width: $(".con-body-top").width() * 1.1,
		height: $(".con-body-top").height() * 0.78,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	});
	$(".selectedname>li").css({
		width: $(".con-body-top").width() * 0.8,
		"margin-left": $(".con-body-top").width() * 0.06,
	});
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
		var aSTB = strb;
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

function ConnectLoad() {
	//判断是否已经连接
	if(connectStatus) {
		GetSatelliteList();
	} else {
		wlanConnectTimer = setInterval(function() {
			wlanConnectSTB();
		}, 2000);
	}
	setTimeout(function() {
		window.clearInterval(wlanConnectTimer);
		if(connectStatus == false) {
			clearInterval(WlanTimer);
			$.MsgBox.Alert("Warning", "WIFI account or password is wrong");
			$(".stb-connectLoad").addClass("hide-section");
			$(".stb-wifiPwd").removeClass("hide-section");
		}
	}, 35 * 1000);
}

function GetSatelliteList() {
	var Str = "传递给 java 的数据";
	window.WebViewJavascriptBridge.callHandler("HIG_GetSatelliteList", Str, function(responseData) {
		var jsonbj = JSON.parse(responseData);
		SatelliteList = JSON.parse(responseData);
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
			carrierID = stataModel.transponderModelArr[0].carrierID;
			$(".stb-connectLoad").addClass("hide-section");
			$(".stb-channelList").removeClass("hide-section");
			showSatelliteList();
		}, 9000);
	});
}

function showSatelliteList() {
	$(".body-top").empty();
	$(".body-top").append('<p>Antenna Configure</p>');
	times = setInterval(function() {
		var jsonobj = {
			"carrierID": carrierID
		};
		var data = JSON.stringify(jsonobj);
		getTuneTransPorter(data);
	}, 1500);
	for(var i = 0; i < SatelliteList.length; i++) {
		if(SatelliteList[i].satelliteID == satelliteID) {
			StateModal = SatelliteList[i];
			listArray.push(StateModal.transponderModelArr);
			var list = $(".channel li .paramater");
			for(var i = 0; i < list.length; i++) {
				//var channel =  $(list[i]).find("paramater");
				var channelable = $(list[i]).find("label")[0];
				var nameLable = StateModal[nameList[i]];
				if(i == 2) {
					var nameLableList = listArray[i];
					var lowLoF = StateModal.lowLOF == 0 ? nameLableList[0][0] : StateModal.lowLOF;
					var highLOF = StateModal.highLOF == 0 ? nameLableList[1][0] : StateModal.highLOF;
					$(channelable).html(lowLoF + "/" + highLOF);
					lowIndex = nameLableList[0].indexOf(lowLoF);
					highIndex = nameLableList[1].indexOf(highLOF);
					StateModal.lowLOF = lowLoF;
					StateModal.highLOF = highLOF;
				} else if(i == list.length - 1) {
					//			nameLable = stateModel[nameList[i]];
					$(channelable).html(listArray[i][0].frequency + "/" + listArray[i][0].symbolRate);
				} else {
					$(channelable).html(listArray[i][nameLable]);
					listLab = listArray[i][listArray[nameLable]];
				}
			}
		}
	}
}

function getTuneTransPorter(datas) {
	window.WebViewJavascriptBridge.callHandler('HIG_TuneTransporter', datas, function(responseData) {
		var Obj = JSON.parse(responseData);
		if(Obj.return == "1") {
			var progressWidth = $(".progress").width();
			//	   alert(Obj.quality +" vbfv" + Obj.signal);
			$(".Quality").width(progressWidth * Obj.quality * 0.01);
			//	Strength
			$(".Strength").width(progressWidth * Obj.signal * 0.01);
		}
	});
}

function setSatelliteParam(datas) {
	window.WebViewJavascriptBridge.callHandler('HIG_SetSatelliteParam', datas, null);
}

function creatSTBPIN() {
	window.clearInterval(times);
	if(isDisplay) {
		$(".content-body").css({
			"height": "50%",
			"width": "100%"
		});
		$(".square-content,.body-square").css({
			"height": "40%",
			"width": "76%"
		});
	} else {
		$(".content-body").css({
			"height": "40%",
			"width": "100%"
		});
		$(".square-content,.body-square").css({
			"height": "26%",
			"width": "76%"
		});
	}
	$(".body-top").empty();
	$(".body-top").append('<p>Create PIN Code</p>');
}

function checkSTBPIN(data) {
	window.WebViewJavascriptBridge.callHandler('HIG_CheckSTBPIN', data, function(responseData) {
		if(responseData == "true") {
			$(".stb-PIN").addClass("hide-section");
			$(".stb-parental").removeClass("hide-section");
			parentalRating();
			getParanttalGuideRating();
		} else {
			$.MsgBox.Alert("Warning", responseData);
			newPIN = "";
			oldPIN = "";
			$(".enter").css("display", "block");
			$(".confirm").css("display", "none");
			var newPINArray = $("#newPIN").find("u");
			for(var i = 0; i < newPINArray.length; i++) {
				$(newPINArray[i]).removeClass("selectCode");
			}
			var oldPINArray = $("#oldPIN").find("u");
			for(var i = 0; i < oldPINArray.length; i++) {
				$(oldPINArray[i]).removeClass("selectCode");
			}
		}
	});
}

function getParanttalGuideRating() {
	$(".body-top").empty();
	$(".body-top").append('<p>Parental Control</p>');
	window.WebViewJavascriptBridge.callHandler('HIG_GetParentalGuideRating', " ", function(responseData) {
		var jsonObj = JSON.parse(responseData);
		parentalGuideRating = jsonObj.parentalGuideRating == "" ? 0 : jsonObj.parentalGuideRating;
	});
}

function parentalRating() {
	if(isDisplay) {
		$(".content-body").css({
			"width": $(window).width(),
			"height": $(window).height() * 0.68
		});
		$(".square-content,.body-square").css({
			"height": "62%",
			"width": "76%"
		});
	} else {
		$(".content-body").css({
			"width": $(window).width(),
			"height": $(window).height() * 0.62
		});
		$(".square-content,.body-square").css({
			"height": "52%",
			"width": "76%"
		});
	}

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
			$(".round").on("click", function() {
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
				window.WebViewJavascriptBridge.callHandler('HIG_SetParantalGuideRating', data, null);
			});
		} else {
			for(var i = 0; i < roundList.length; i++) {
				var controls = $(roundList[i]).find('span')[0];
				$(controls).removeClass('selcted');
			}
		}
	});
}

function getMobileInfo() {
	window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo', " ", function(responseData) {
		var mobileInfo = JSON.parse(responseData);
		if(mobileInfo.SSID != null && mobileInfo.SSID.indexOf('STB') >= 0) {
			signalStrength = mobileInfo.SignalStrength;
			SSIDName = mobileInfo.SSID;
			$("#CName").html(SSIDName.length > 4 ? SSIDName.substring(4, SSIDName.length) : '');
		} else {
			$("#CName").html('');
		}
	});
}

function getMobileSignal() {
	$(".Selector").css({
		"width": "100%",
		"height": "100%"
	});
	$(".HIGContent-header").height($(window).height() * 0.25);
	$(".HIGContent-body").css({
		"width": "100%",
		"height": $(window).height() * 0.55 //0.55
	});
	$(".content-body").css({
		"width": $(window).width(),
		"height": $(window).height() * 0.63, //0.63
		"z-index": "-1",
		"position": "relative"
	});
	$(".body-square").css({
		height: "80%", //55
		width: "76%",
		background: "url(./img/blur.png) center center no-repeat",
		"background-size": "100%"
	});
	$(".square-content").css({
		height: "80%", //55
		width: "76%"
	});
	$(".selectDecoder").css({
		"margin-top": "6%"
	});
	mySwiper = new Swiper('.wifi-container', {
		direction: "horizontal",
		pagination: '.swiper-pagination',
		height: 250, //你的slide高度
		width: $(window).width()

	});
	$(".wifi-btn").css('background-color', '#FC355B');
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
	}, 1000);
}

function wifiConnect() {
	var showPWD;
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
	});
	var myinput = document.getElementById("Pwd");
	addListener(myinput, "click", function(el) {
		myinput.setAttribute("type", "password");
		if(showPWD) {
			myinput.setAttribute("type", "text");
		}
		myinput.placeholder = "PASSWORD";
		myinput.value = '';
	});
}

function HIG_STBWlanAP(datas) {
	window.WebViewJavascriptBridge.callHandler(
		"HIG_STBWlanAP",
		datas,
		function(responseData) {
			var wlanData = JSON.parse(responseData);
			if(wlanData.return == 1) {
				clearInterval(WlanTimer);
				ConnectLoad();
				$(".stb-wifiPwd").addClass("hide-section");
				$(".stb-connectLoad").removeClass("hide-section");
			}
		});
}

function wlanConnectSTB() {
	var data = '发送消息给java代码指定接收';
	window.WebViewJavascriptBridge.callHandler(
		"HIG_GetSTBList",
		data,
		function(responseData) {
			var wlanObj = JSON.parse(responseData);
			$.map(wlanObj, function(item, index) {
				if(SSIDName.length > 4 && SSIDName.substring(4, SSIDName.length) == item.stb.sTBID.toUpperCase()) {
					clearInterval(wlanConnectTimer);
					wlanConnect(JSON.stringify(item));
				}
			});
		});
}

function wlanConnect(datas) {
	window.WebViewJavascriptBridge.callHandler(
		"HIG_ConnectSTB",
		datas,
		function(responseData) {
			var Obj = JSON.parse(responseData);
			if(Obj.return == 1) {
				connectStatus = true;
				isDisplay = true;
				//			clearInterval(WlanTimer);
				//			clearInterval(mobileTimer);
				GetSatelliteList();
			} else {
				connectStatus = false;
			}
		});
}
