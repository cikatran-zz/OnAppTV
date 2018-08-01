var SatelliteID;
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
var carrierID;
var timer;
var lowIndex;
var highIndex;
window.onload = function() {
	window.WebViewJavascriptBridge.callHandler('Search');
	timer = setInterval(function() {
		var jsonobj = {
			"carrierID": carrierID
		};
		var data = JSON.stringify(jsonobj);
		window.WebViewJavascriptBridge.callHandler('HIG_TuneTransporter', data);
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
	bridge.registerHandler('HIG_GetSatelliteList', function(data, responseCallback) {
		var jsonObj = JSON.parse(data);
		for(var i = 0; i < jsonObj.length; i++) {
			if(jsonObj[i].satelliteID == SatelliteID) {
				StateModal = jsonObj[i];
				listArray.push(StateModal.transponderModelArr);
				var list = $(".list li .paramater");
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
	})
	bridge.registerHandler('HIG_GetSignal', function(data, responseCallback) {
		var Obj = JSON.parse(data);
		if(Obj.return == "1") {
			var progressWidth = $(".progress").width();
			//	   alert(Obj.quality +" vbfv" + Obj.signal);
			$(".Quality").width(progressWidth * Obj.quality * 0.01);
			//	Strength
			$(".Strength").width(progressWidth * Obj.signal * 0.01);
		}
	})
})

$(function() {
	SatelliteID = $.query.get("list");
	carrierID = $.query.get("carrierID");

	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		window.clearInterval(timer);
		document.location.href = "STB-PIN.html";
	});

	$(".content-body").css({
		"width": $(window).width(),
		"height": $(window).height() * 0.64
	})
	if($(window).height() < 570) {
		$(".square").css({
			"padding": ".5rem .6rem .5rem .6rem"
		})
		$(".square li").css({
			"height": "1.22em !important"
		})
		$(".square li lable").css({
			'line-height':"2em !important"
		})
	}
	var lilist = $(".list li");
	$(".btn-left").on("tap",function() {
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
				}
			}
		}
		var data = JSON.stringify(StateModal);
		window.WebViewJavascriptBridge.callHandler('HIG_SetSatelliteParam', data);
	})
	$(".btn-right").on("tap",function() {
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
		window.WebViewJavascriptBridge.callHandler('HIG_SetSatelliteParam', data);
	})
})