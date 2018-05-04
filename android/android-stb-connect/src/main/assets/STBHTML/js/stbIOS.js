$(function() {
	   $("#Avalible").on('click', function() {
	       //状态
	       window.clearInterval(times);
	       var obj = {
	           "connectState": connectStatus
	       };
	       var data = JSON.stringify(obj);
	       window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	   })

	// $("#btn-conn").click(function() {
	// 	// $("body").addClass('bg');
	// 	var currentBtnColor = $(this).css('background-color');
	// 	if(currentBtnColor == 'rgb(252, 53, 91)') {
	// 		for(var i = 0; i < jsonObj.length; i++) {
	// 			if(jsonObj[i].stb.sTBID == wifiName) {
	// 				if(time == 0) {
	// 					time = 3; //设置间隔时间（秒）
	// 					//机顶盒连接
	// 					var Str = JSON.stringify(jsonObj[i]);
	// 					window.WebViewJavascriptBridge.callHandler('HIG_ConnectSTB', Str);
	// 					setTimeout(function() {
	// 						if(!connectStatus) {
	// 							$.MsgBox.Alert("Warning!", "The connection failed, please reconnect");
	// 							//关闭打开的checkbox
	// 							var checkArray = $("input[type='checkbox']");
	// 							for(var i = 0; i < checkArray.length; i++) {
	// 								if(checkArray[i].checked) {
	// 									checkArray[i].checked = false;
	// 								}
	// 							}
	// 							$("#btn-conn").removeClass("btn-conn");
	// 						}
	// 					}, 6000)
	// 					var timers = setInterval(function() {
	// 						time--;
	// 						if(time == 0) {
	// 							clearInterval(timers);
	// 						}
	// 					}, 1000);
	// 				}
	// 			}
	// 		}
	// 	}
	// });
	$("#Install").click(function() {
		getMobileSignal();
		mobileTimer = setInterval(function() {
			//			getMobileInfo();
			window.WebViewJavascriptBridge.callHandler('HIG_GetMobileWifiInfo');
		}, 1500);
		$(".stb-selectDocoder").addClass("hide-section");
		$(".stb-wifiConnectMode").removeClass("hide-section");
		$(".HIGContent-footer").css('display', 'block');
	});
	$("#skip").click(function() {
		connectStatus = false;
		var obj = {
	 		"connectState": connectStatus
	 	};
	 	var data = JSON.stringify(obj);
	 	window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
	})


	$("#connectWlanAP").click(function() {
		//验证密码
		var wifi = $("#wifiName").val();
		var pwd = $("#Pwd").val();
		$(this).css('background-color', '#eeeeee');
		setTimeout(function(){
			$("#connectWlanAP").css('background-color', '#FC355B');
		},2000);
		if (wifi == "" || pwd == "") {
			$.MsgBox.Alert('Warning', 'Enter Error');
		} else {
			var wifiCheckData = {
				"SSID": wifi,
				"Password": pwd
			};
			var wifiData = JSON.stringify(wifiCheckData);
			clearInterval(mobileTimer);
			WlanTimer = setInterval(function() {
				window.WebViewJavascriptBridge.callHandler('HIG_STBWlanAP', wifiData);
			}, 2000);
			setTimeout(function() {
				clearInterval(wlanConnectTimer);
				if (jsonObj.length == 0) {
					$.MsgBox.Alert("Warning", "WIFI account or password is wrong");
				};
			}, 40 * 1000);
		}
	});

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
		if (j >= 0 && j < 10) {
			if (oldPIN.length < 4) {
				//获取输入
				var PINArray = $("#oldPIN").find("u");
				$(PINArray[oldPIN.length]).addClass("selectCode");
				oldPIN += codeLable;
				if (oldPIN.length == 4) {
					setTimeout(function() {
						$(".enter").css("display", "none");
						$(".confirm").css("display", "block");
						newPIN = "";
					}, 1000);
				}
			} else if (newPIN.length < 4) {
				//获取输入
				var PINArray = $("#newPIN").find("u");
				$(PINArray[newPIN.length]).addClass("selectCode");
				newPIN += codeLable;
				if (newPIN.length == 4) {
					setTimeout(function() {
						//判断两次输入密码是否相同
						if (oldPIN == newPIN) {
							//发送请求
							var obj = {
								"oldPIN": oldPIN,
								"newPIN": newPIN
							};
							var data = JSON.stringify(obj);
							//checkSTBPIN(data);
							window.WebViewJavascriptBridge.callHandler('HIG_CheckSTBPIN', data);
						} else {
							//alert("PIN input is Incorrect, Please Re-Enter");
							$.MsgBox.Alert("Warning", "Password doesn't match");
							newPIN = "";
							oldPIN = "";
							$(".enter").css("display", "block");
							$(".confirm").css("display", "none");
							var newPINArray = $("#newPIN").find("u");
							for (var i = 0; i < newPINArray.length; i++) {
								$(newPINArray[i]).removeClass("selectCode");
							}
							var oldPINArray = $("#oldPIN").find("u");
							for (var i = 0; i < oldPINArray.length; i++) {
								$(oldPINArray[i]).removeClass("selectCode");
							}
						}
					}, 500);
				}
			}
		} else if ($(this).hasClass("delete")) {
			if (oldPIN.length < 4) {
				var PINArray = $("#oldPIN").find("u");
				$(PINArray[oldPIN.length - 1]).removeClass("selectCode");
				oldPIN = oldPIN.substr(0, oldPIN.length - 1);
			} else if (oldPIN.length == 4) {
				//判断当前新密码中的长度
				if (newPIN.length > 0) {
					var PINArray = $("#newPIN").find("u");
					$(PINArray[newPIN.length - 1]).removeClass("selectCode");
					newPIN = newPIN.substr(0, newPIN.length - 1);
				} else {
					var PINArray = $("#oldPIN").find("u");
					$(PINArray[oldPIN.length - 1]).removeClass("selectCode");
					oldPIN = oldPIN.substr(0, oldPIN.length - 1);
				}
			} else if (newPIN.length <= 4) {
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
		for (var i = 0; i < lilist.length; i++) {
			var channelLable = $(lilist[i]).find("label")[1];
			var title = $(lilist[i].children[0]).html();
			if (lableTitle.innerHTML == title) {
				if (i == 2) {
					for (var d = 0; d < listArray[i].length; d++) {
						var ind = listArray[i][d].indexOf(lowLOF);
						ind--;
						if (ind != lowIndex - 1) {
							if (ind < 0) {
								ind = listArray[i][d].length - 1;
							} else if (ind == listArray[i][d].length) {
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
							if (highIndex - 1 != ind2) {
								if (ind2 < 0) {
									ind2 = listArray[i][d].length - 1;
								} else if (ind2 <= listArray[i][d].length) {
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
				} else if (i == lilist.length - 1) {
					$(channelLable).html(listArray[i][0].frequency + "/" + listArray[i][0].symbolRate);
					StateModal.transponderModelArr[0].frequency = listArray[i][0].frequency;
					StateModal.transponderModelArr[0].symbolRate = listArray[i][0].symbolRate;
				} else {
					for (var j = 0; j < listArray[i].length; j++) {
						if (listArray[i][j] == $(channelLable).html()) {
							index = j;
						}
					}
					index--;
					if (index < 0) {
						index = listArray[i].length - 1;
					}
					StateModal[nameList[i]] = index;
					$(channelLable).html(listArray[i][index]);
				}
			}
		}
		var data = JSON.stringify(StateModal);
		window.WebViewJavascriptBridge.callHandler('HIG_SetSatelliteParam', data);
	});
	$(".btn-right").on("click", function() {
		var lableTitle = $(this).parent().prev()[0];
		var index = 0;
		var lowLOF = StateModal.lowLOF;
		var highLOF = StateModal.highLOF;
		for (var i = 0; i < lilist.length; i++) {
			var title = $(lilist[i].children[0]).html();
			var channelLable = $(lilist[i]).find("label")[1];
			if (lableTitle.innerHTML == title) {
				if (i == 2) {
					for (var d = 0; d < listArray[i].length; d++) {
						var ind = listArray[i][d].indexOf(lowLOF);
						ind++;
						if (ind != lowIndex + 1) {
							if (ind < 0) {
								ind = listArray[i][d].length - 1;
							} else if (ind >= listArray[i][d].length) {
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
							if (highIndex + 1 != ind2) {
								if (ind2 < 0) {
									ind2 = listArray[i][d].length - 1;
								} else if (ind2 >= listArray[i][d].length) {
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
				} else if (i == lilist.length - 1) {
					//			nameLable = stateModel[nameList[i]];
					$(channelLable).html(listArray[i][0].frequency + "/" + listArray[i][0].symbolRate);
					//			listLab = listArray[i][nameLable];
				} else {
					for (var j = 0; j < listArray[i].length; j++) {
						if (listArray[i][j] == $(channelLable).html()) {
							index = j;
						}
					}
					index++;
					if (index == listArray[i].length) {
						index = 0;
					}
					//	var stateModel = data[data.length - 1];
					StateModal[nameList[i]] = index;
					$(channelLable).html(listArray[i][index]);
				}
			}

		}
		var data = JSON.stringify(StateModal);
		window.WebViewJavascriptBridge.callHandler('HIG_SetSatelliteParam', data);
	});
});
/**
 * js 和 iOS的桥
 * @param {Object} callback
 */
function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if (window.WVJBCallbacks) {
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
			bridge.registerHandler('HIG_ConnectSTB', function(data, responseCallback) {
				var Obj = JSON.parse(data);
				if (Obj.return == "1") {
					clearInterval(infoTimer);
					connectStatus = true;
					if (nums == 'notFirst') {
						// $("body").addClass("bg");
						$(".stb-selectSTB").addClass("hide-section");
						$(".stb-Geographc").removeClass("hide-section");
					} else {
						// $("body").removeClass('bg');
						$(".stb-selectSTB").addClass("hide-section");
						$(".stb-connectLoad").removeClass("hide-section");
						ConnectLoad();
					}
				} else {
					//连接失败
					connectStatus = false;
				}
			});
			bridge.registerHandler("HIG_GetSTBList", function(data, responseCallback) {
				STBList = JSON.parse(data);
				if (jsonObj.length > 0) {
					flag += 1;
					arrData.push(STBList);
					if (flag % 2 == 0) {
						var getArray = getObjectFromArray(arrData);
						arrData = [];
						flag == 0;
						var del = compareObject(getArray, jsonObj);
						var arr = compareObject(jsonObj, getArray);
						loadData(arr);
					}
				}
			});
			bridge.registerHandler("HIG_UndiscoveredSTBList", function(data, responseCallback) {
				notFounfArray.push(JSON.parse(data));
				var getNotArray = getCutObjectFromArray(notFounfArray);
				notFounfArray = [];
				loadNotFoundList(getNotArray);
			});
			bridge.registerHandler('HIG_GetMobileWifiInfo', function(data, responseCallback) {
				var mobileInfo = JSON.parse(data);
				if (mobileInfo.SSID != null && mobileInfo.SSID.indexOf('STB') >= 0) {
					signalStrength = mobileInfo.SignalStrength;
					SSIDName = mobileInfo.SSID;
					$("#CName").html(SSIDName.length > 4 ? SSIDName.substring(4, SSIDName.length) : '');
				} else {
					$("#CName").html('');
				}
			});
			bridge.registerHandler('HIG_STBWlanAP', function(data, responseCallback) {
				var wlanData = JSON.parse(data);
				if (wlanData.return == 1) {
					clearInterval(WlanTimer);
					isDisplay = true;
					ConnectLoad();
					$(".stb-wifiConnect").addClass("hide-section");
					$(".stb-revolution").removeClass("hide-section");
					stbListInfo();
				}
			});
			bridge.registerHandler('HIG_GetSatelliteList', function(data, responseCallback) {
				var jsonbj = JSON.parse(data);
				SatelliteList = JSON.parse(data);
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
			bridge.registerHandler('HIG_CheckSTBPINCallback', function(data, responseCallback) {
					if (data == true) {
						var obj = {
							"connectState": connectStatus
						};
						var data = JSON.stringify(obj);
						setTimeout(function() {
							window.WebViewJavascriptBridge.callHandler('HIG_STBConnectStatus', data);
						}, 500);

						// $(".stb-PIN").addClass("hide-section");
						// $(".stb-Geographc").removeClass("hide-section");
						// parentalRating();
						// getParanttalGuideRating();
					} else {
						$.MsgBox.Alert("Warning", data);
						newPIN = "";
						oldPIN = "";
						$(".enter").css("display", "block");
						$(".confirm").css("display", "none");
						var newPINArray = $("#newPIN").find("u");
						for (var i = 0; i < newPINArray.length; i++) {
							$(newPINArray[i]).removeClass("selectCode");
						}
						var oldPINArray = $("#oldPIN").find("u");
						for (var i = 0; i < oldPINArray.length; i++) {
							$(oldPINArray[i]).removeClass("selectCode");
						}
					}
		});
			bridge.registerHandler('HIG_GetParentalGuideRating', function(data, responseCallback) {
					var jsonObj = JSON.parse(data);
					parentalGuideRating = jsonObj.parentalGuideRating == "" ? 0 : jsonObj.parentalGuideRating;
				}); bridge.registerHandler('HIG_TuneTransporter', function(data, responseCallback) {
					var porter = JSON.parse(data);
					if (porter.return == "1") {
						var progressWidth = $(".progress").width();
						$(".Quality").width(progressWidth * Obj.quality * 0.01);
						//	Strength
						$(".Strength").width(progressWidth * Obj.signal * 0.01);
					};
				})
			});

		function stbListInfo() {
			$(".con-body-top").height($(window).height() * 0.76);
			if (isDisplay) {
				jsonObj = [];
				STBList = [];
				revolutionTimer(35);
			} else {
				revolutionTimer(7);
			}
			infoTimer = setInterval(function() {
				// getUnDisCoverStbLists();
				window.WebViewJavascriptBridge.callHandler(
					"HIG_UndiscoveredSTBList");
				window.WebViewJavascriptBridge.callHandler(
					"HIG_GetSTBList");
			}, 2500);
		}

		function ConnectLoad() {
			//判断是否已经连接
			if (connectStatus == true) {
				window.WebViewJavascriptBridge.callHandler("HIG_ParseXMLLast");
				window.WebViewJavascriptBridge.callHandler("HIG_GetSatelliteList");
			} else {
				wlanConnectTimer = setInterval(function() {
					//			wlanConnectSTB();
					window.WebViewJavascriptBridge.callHandler("HIG_GetSTBList");
				}, 2000);
			}
		}

		function longPress() {
			timeOutEvent = 0;
			alert("长按事件触发");
		}

		function checkWhetherConnect() {
			var list = $('.selectedname').find("li");
			var checklist = $(".selectedname").find($("input[type='checkbox']:checked"));
			// if(checklist.length == 0) {
			// 	$("#btn-conn").addClass("btn-conn");
			// } else {
			// 	$("#btn-conn").removeClass("btn-conn");
			// }
			//获取点击的checkbox
			$("input[type='checkbox']").on('click', function() {
				//判断父级节点
				if ($(this).parents().is(".selectedname")) {
					//判断点击的 checkbox 是否打开
					if (this.checked) {
						$(list).each(function(index, item) {
							var check = $(item).children("input[type='checkbox']")[0];
							if (check.checked) {
								check.checked = false;
							}
						});
						this.checked = true;
						wifiName = $(this).prev().html();
						window.clearInterval(infoTimer);
						setTimeout(function() {
							$.map(jsonObj, function(item, index) {
								if (item.stb.sTBID == wifiName) {
									setTimeout(function(){
										window.WebViewJavascriptBridge.callHandler("HIG_ConnectSTB", JSON.stringify(item));
									},1000);
								};
							});
						}, 1000);
						// if ($("#btn-conn").hasClass('btn-conn')) {
						// $("#btn-conn").removeClass("btn-conn");
					} else {
						this.checked = false;
						// if (!$("#btn-conn").hasClass('btn-conn')) {
						// $("#btn-conn").addClass("btn-conn");
					}
				}
			});
		}

		function getParanttalGuideRating() {
			$(".body-top").empty();
			$(".body-top").append('<p>Parental Control</p>');
			window.WebViewJavascriptBridge.callHandler('HIG_GetParentalGuideRating');
		}

		function parentalRating() {
			$(".content-body").css({
				"width": $(window).width(),
				"height": $(window).height() * 0.62
			})
			$(".square-content,.body-square").css({
				"height": "52%",
				"width": "76%"
			});
			//判断是否打开checkbox
			$("input[type='checkbox']").click(function() {
				var roundList = $(".round");
				for (var i = 0; i < roundList.length; i++) {
					var controls = $(roundList[i]).find('span')[0];
					if ($(controls).html() == parentalGuideRating) {
						$(controls).addClass('selcted');
					}
				}
				var check = this;
				if (check.checked) {
					$(".round").on("click", function() {
						if (check.checked) {
							for (var i = 0; i < roundList.length; i++) {
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
					for (var i = 0; i < roundList.length; i++) {
						var controls = $(roundList[i]).find('span')[0];
						$(controls).removeClass('selcted');
					}
				}
			})
		}

		function showSatelliteList() {
			$(".body-top").empty();
			$(".body-top").append('<p>Antenna Configure</p>');
			times = setInterval(function() {
				var jsonobj = {
					"carrierID": carrierID
				};
				var data = JSON.stringify(jsonobj);
				window.WebViewJavascriptBridge.callHandler("HIG_TuneTransporter", data);
			}, 1500);
			for (var i = 0; i < SatelliteList.length; i++) {
				if (SatelliteList[i].satelliteID == satelliteID) {
					StateModal = SatelliteList[i];
					listArray.push(StateModal.transponderModelArr);
					var list = $(".channel li .paramater");
					for (var i = 0; i < list.length; i++) {
						//var channel =  $(list[i]).find("paramater");
						var channelable = $(list[i]).find("label")[0];
						var nameLable = StateModal[nameList[i]];
						if (i == 2) {
							var nameLableList = listArray[i];
							var lowLoF = StateModal.lowLOF == 0 ? nameLableList[0][0] : StateModal.lowLOF;
							var highLOF = StateModal.highLOF == 0 ? nameLableList[1][0] : StateModal.highLOF;
							$(channelable).html(lowLoF + "/" + highLOF);
							lowIndex = nameLableList[0].indexOf(lowLoF);
							highIndex = nameLableList[1].indexOf(highLOF);
							StateModal.lowLOF = lowLoF;
							StateModal.highLOF = highLOF;
						} else if (i == list.length - 1) {
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
