var nY = 0;
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
	$("#picID").attr("src", "img/TROPICALISLAND_42.gif");
	var swiper = new Swiper('.on-container', {
		direction: "horizontal",
		pagination: '.swiper-pagination',
		width: document.documentElement.clientWidth,
		height: 250, //你的slide高度
		slidesPerView: 1,
		iOSEdgeSwipeDetection: true, //设置为true开发IOS的UIWebView环境下的边缘探测，如果拖动距离从屏幕边缘开始则不触发swiper
		iOSEdgeSwipeThreshold: 50, //IOS的webview环境下的边缘探测距离，如果拖动小于边缘探测距离则不触发swiper
		resistanceRatio: 0, //让slider在边缘不能被拖动
		autoplay: 2000,
		loop: true,
		slidesPerView: 1,
		visibilityFullFit: true,
		autoplayDisableOnInteraction: false,
		observer: true, //修改swiper自己或子元素时，自动初始化swiper
		observeParents: true, //修改swiper的父元素时，自动初始化swiper
	});
	$("#RegisterModal").css({
		"width": "100%",
		"height": "100%",
		"position": "absolute"
	});
	$(".STB-bg").css({
		height: $(window).height(),
		width: $(window).width()
	})
	$("input[type='text']" || "input[type='password']").on('focus', function() {
		var _this = this;
		setTimeout(function() {
			_this.scrollIntoView(true);
			_this.scrollIntoViewIfNeeded();
		}, 200);
	});
		//弹出窗口
	$("#faceBookLogin").click(function() {
		$("#facebookModal").modal({
			keyboard: true
		})
		//增加一层遮罩效果
		$("#facebookModal").before('<div class="mask"></div>');
	})
	$("#close-connect").click(function() {
		$(".stb-wifiConnect").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	})
	$("#close-wifi").click(function() {
		$(".stb-wifiPwd").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	})
	$("#WifiCheck-Mode").click(function() {
	 $(".stb-wifiConnectMode").addClass("hide-section");
	  $(".stb-wifiConnect").removeClass("hide-section");
	  connectwifi();
	});
	$("#WifiCheck-manual").click(function(){
      $(".stb-wifiConnectMode").addClass("hide-section");
	  $(".stb-conntectStep").removeClass("hide-section");
	  connectStep();
	});
	$("#btn-skip").click(function() {
		if(jsonObj.length > 0) {
			connectStatus = false;
			// $("body").addClass('bg');
			$(".stb-selectSTB").addClass("hide-section");
			$(".stb-Geographc").removeClass("hide-section");
		}
	});
	$("#closeWifiConnectMode").click(function(event) {
		clearInterval(mobileTimer);
		$(".stb-wifiConnectMode").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	});
	closewifiConnect
	$("#closewifiConnect").click(function(event) {
		clearInterval(mobileTimer);
		$(".stb-wifiConnect").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
	});
	$("#closeStep").click(function(event) {
		clearInterval(mobileTimer);
		$(".stb-conntectStep").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
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

	$("#WifiCheck").click(function() {
		var currentBtnColor = $(".wifi-btn").css('background-color');
		if(currentBtnColor == 'rgb(252, 53, 91)') {
			clearInterval(myTimer);
			$(".stb-wifiConnect").addClass("hide-section");
			$(".stb-wifiPwd").removeClass("hide-section");
			wifiConnect();
		}
	})
	$(".num-code").append('<tr class="num-line"><td class="code">1</td><td class="code margin_center">2</td><td class="code side">3</td></tr>' +
		'<tr class="num-line"><td class="code">4</td><td class="code margin_center">5</td><td class="code side">6</td></tr>' +
		'<tr class="num-line"><td class="code">7</td><td class="code margin_center">8</td><td class="code side">9</td></tr>' +
		'<tr class="num-line"><td class="code" style="background:none"></td><td class="code margin_center">0</td><td class="code delete side"><img class="backfr" src="img/number_Delete.png"/></td></tr>');


	//年龄下拉框(计算100岁之内的)
	var nowDate = new Date();
	var ageSelect = $("#age");
	for(var year = 1; year < 150; year++) {
		var options = document.createElement('option');
		options.value = year;
		var txt = document.createTextNode(year + " Years ");
		options.appendChild(txt);
		$(ageSelect).append(options);
	}
});

function changeResize() {
	Height = $(window).height();
	var topheight = $(".sign-header")[0].offsetHeight;
	var bodyheight = $(".sign-body")[0].offsetHeight;

	$(".sign-footer").height(Height - (topheight + bodyheight));
	$(".imgbg").height(Height - (topheight + bodyheight));
	$(".SelectList").height(Height - (topheight + bodyheight));

	//开始滑动手势
	var startY;
	var moveY;
	//阻止浏览器下拉事件
	$('body').on('touchmove', function(event) {
		event.preventDefault();
	});
	//	1.开始滑动
	$(".sign-footer").on("touchstart", function(e) {
		startY = e.originalEvent.changedTouches[0].pageY;
	});
	//  2.滑动移动
	$(".sign-footer").on("touchmove", function(e) {
		moveY = e.originalEvent.changedTouches[0].pageY;
		var y = startY - moveY;
		//滑动的距离
		nY = nY + y;
		if(y > 0) {
			//获取footer的高度
			var foot = $(this).height();
			if(foot + y < Height) {
				$(this).css({
					"height": foot + y,
					"position": "absolute",
					"top": Height - foot - y,
					"z-index": "100"
				});
				$(".imgbg").css({
					"height": foot + y,
					"background-size": "100% "
				});
			} else {
				$(this).css({
					"height": Height,
					"position": "absolute",
					"z-index": "100"
				});
				$(".imgbg").css({
					"height": Height,
					"background-size": "100% 100%"
				});
			}

		} else {
			//获取footer的高度
			var foot = $(this).height();
			//判断footer的位置
			if(Height - foot < Height - topheight - bodyheight) {
				//footer占据整个界面时
				//判断是否已经存在关闭按钮，如果存在就删除
				var dom = document.getElementById("CloseModal");
				if(dom) {
					dom.parentNode.removeChild(dom);
				}
				//显示header中的关闭按钮
				$("#dismiss-signIn").css("display", "block");
				//判断下滑
				if(foot + y > Height - topheight - bodyheight) {
					$(this).css({
						"height": Height + y,
						"position": "absolute",
						"top": -y,
						"z-index": "100"
					});
					$(".imgbg").css({
						"height": Height + y,
						"background-size": "100% auto"
					});

				} else {
					$(this).css({
						"height": Height - topheight - bodyheight,
						"position": "relative",
						"top": 0,
						"z-index": "100"
					});
					$(".imgbg").css({
						"height": Height - topheight - bodyheight,
						"background-size": "100% auto"
					});
				}
				$(".SelectList").css("bottom", 0);
			}
		}
	});
	//	3.滑动结束
	$(".sign-footer").on("touchend", function(e) {
		var footer = $(this).height();
		//判断界面
		if(Height - footer > 50) {
			var foot = Height - topheight - bodyheight;
			$(this).css({
				"height": foot,
				"position": "absolute",
				"top": topheight + bodyheight,
				"z-index": "1"
			});
			$(".imgbg").css({
				"height": foot,
				"background-size": "100% auto"
			});

		} else {
			$(this).css({
				"height": Height,
				"top": "0",
				"position": "absolute",
				"z-index": "100"
			});
			$(".imgbg").css({
				"height": Height,
				"position": "absolute",
				"top": 0,
				"bottom": 0,
				"background-size": "100% 100%"
			});
			//			alert( Height +"比较"  + $(".imgbg").height());
			//	判断是否已经存在关闭按钮，如果存在就删除
			var dom = document.getElementById("CloseModal");
			//隐藏header中的关闭按钮
			$("#dismiss-signIn").css("display", "none");
			if(dom) {
				dom.parentNode.removeChild(dom);
			}
			closeHTML = '<a href="#"  id="CloseModal" onclick="CloseModal()"  class="close"></a>';
			$(".sign-footer").append(closeHTML);
		}
		$(".SelectList").css("bottom", 0);
	});
}

function CloseModal() {
	var dom = document.getElementById("CloseModal");
	if(dom) {
		dom.parentNode.removeChild(dom);
	}
	var topheight = $(".sign-header")[0].offsetHeight;
	//	console.log(topheight);
	var bodyheight = $(".sign-body")[0].offsetHeight;
	//显示header中的关闭按钮
	$("#dismiss-signIn").css("display", "block");
	var footerheight = Height - topheight - bodyheight;
	$(".sign-footer").css({
		"height": footerheight,
		"position": "absolute",
		"top": topheight + bodyheight
	});
	//	$(".imgbg").css("height", footerheight);
	$(".imgbg").css({
		"height": footerheight,
		"background-size": "100% auto"
	});
}
function revolutionTimer(d) {
	setTimeout(function() {
		if(STBList.length <= 0) {
			$(".stb-revolution").addClass("hide-section");
			$(".stb-selectDocoder").removeClass("hide-section");
			clearInterval(infoTimer);
		} else {
			$(".stb-revolution").addClass("hide-section");
			$(".stb-selectSTB").removeClass("hide-section");
			//判断是否是第一次加载
			if(jsonObj.length == 0) {
				// var stbjson = '[{"stb":{"loaderVersion":1,"iPAddress":"192.168.10.153","softwareVersion":1,"sTBID":"03485498","oUI":"0000169b","macAddress":"BC:14:EF:C5:EB:44","hardwareVersion":1},"userName":""},{"stb":{"loaderVersion":1,"iPAddress":"192.168.10.209","softwareVersion":1,"sTBID":"0347a30c","oUI":"0000169b","macAddress":"BC:14:EF:E0:B4:6","hardwareVersion":1},"userName":""}]';
				// STBList = JSON.parse(stbjson);
				var arr = compareObject([], STBList);
				var squareList = $(".selectedname");
				$(squareList).html('');
				loadData(arr);
			}
		}
	}, d * 1000);
	setTimeout(function() {
		if(jsonObj.length <= 0) {
			if($(".stb-selectSTB").css("display") != "none") {
				clearInterval(infoTimer);
				// $("body").removeClass('bg');
				$(".stb-selectSTB").addClass("hide-section");
				$(".stb-selectDocoder").removeClass("hide-section");
			}
		}
	}, (d+7)*1000);
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

function connectwifi(){
	$(".HIGContent-body").height($(window).height() * 0.55);
	$(".connect-container").height($(window).height() * 0.55);
	$(".swiper-wrapper").removeAttr('style');
	$(".swiper-pagination").css("display", "block");
	mySwiper = new Swiper('.connect-container', {
		direction: "horizontal",
		pagination: '.swiper-pagination',
		height:250,
		onSlideChangeStart: function(swiper) {
			if(swiper.activeIndex == 2) {
				$(".HIGContent-footer").css("display", "none");
				$(".swiper-pagination").css("display", "none");
				$(".HIGContent-body").height($(window).height() * 0.8);
				$(".connect-container").height($(window).height() * 0.7);
				wifiConnect();
			} else {
				$(".HIGContent-body").height($(window).height() * 0.55);
				$(".connect-container").height($(window).height() * 0.55);
				$(".HIGContent-footer").css("display", "block");
				$(".swiper-pagination").css("display", "block");
			}
		}
	});
}
function connectStep(){
	$(".HIGContent-body").height($(window).height() * 0.565);
	mywiper = new Swiper('.step-container', {
		direction: "horizontal",
		pagination: '.swiper-pagination',
		onSlideChangeStart: function(swiper){
			if(swiper.activeIndex == 2){
				$("#search").removeClass("search");
			}else{
				$("#search").addClass("search");
			}
    }
	});
}
function creatSTBPIN() {
	window.clearInterval(times);
	if (isDisplay) {
		$(".content-body").css({
		"height": "40%",
		"width": "100%"
	})
	$(".square-content,.body-square").css({
		"height": "60%",
		"width": "76%"
	});
	} else {
		$(".content-body").css({
		"height": "40%",
		"width": "100%"
	})
	$(".square-content,.body-square").css({
		"height": "26%",
		"width": "76%"
	});
	}
	
	$(".body-top").empty();
	$(".body-top").append('<p>Create PIN Code</p>');
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
	myiper = new Swiper('.wifi-container', {
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
	if(jsonObj.length <= 0) {
		$(".stb-selectSTB").addClass("hide-section");
		$(".stb-selectDocoder").removeClass("hide-section");
		clearInterval(infoTimer);
	}
	checkWhetherConnect();
	StbAwakeUp();

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
		} else {
			if(arr[i].length < obj.length) {
				obj = arr[i];
			}
		}
	}
	return obj;
}
//点击唤醒
function StbAwakeUp(){
    $(".listul").find("li").on({
    	touchstart:function(e){
    		timeOutEvent = setTimeout("longPress()",500);
    		e.preventDefault();
    	},
    	touchmove:function(e){
    		clearTimeout(timeOutEvent);
    		timeOutEvent = 0;
    	},
    	touchend:function(e) {
    		clearTimeout(timeOutEvent);
    		if(timeOutEvent != 0){
    			alert("这是点击，不是长按");
    		}
    		return false;
    	}
    })
}
function loadData(obg) {
	var squareList = $(".selectedname");
	//判断是否已经存在
	for(var i = 0; i < obg.length; i++) {
		if(!obg[i].isExist) {
			jsonObj.push(obg[i]);
			$(squareList).append('<li><span class="stb_blue"></span><span class="stb-name">' + obg[i].stb.sTBID + '</span>' +
				'<input type="checkbox" id=' + obg[i].stb.iPAddress + ' class="mui-switch mui-switch-anim dire" name="WifiName" />' + '</li>');
		}
	}
	checkWhetherConnect();
	StbAwakeUp();
}
function loadNotFoundList(data) {
	notFoundList = [];
	$(".listul").html("");
	//获取已经找到的STB列表
	var squareList = $(".selectedname").find("li");
	var isFound = false;
	$(data).each(function(index, model) {
		$(squareList).each(function(index, item) {
			var stbName = $(item).find('span')[1].innerHTML;
			if (model == stbName) {
				isFound = false;
				return false;
			} else {
				isFound = true;
				return true;
			}
		});
		if (isFound) {
			notFoundList.push(model);
			$(".listul").append('<li><span class="stb_dark"></span><span class="stb-name">' + model + '</span></li>');
		};
	});
	StbAwakeUp();
}
function profileSize() {
	$(".con-body-top").css({
		//height: $(window).height() * 0.32
		height: $(window).height() * 0.53,
		"max-height": "14rem"
	});
	$(".con-body-bottom").css({
		"visibility": "hidden",
		//    height: $(window).height() * 0.24
		height: $(window).height() * 0
	});
	var width = $(".con-body-top").width();
	$(".profile_list").css({
		width: $(".con-body-top").width() * 1.1,
		height: $(".con-body-top").height() * 0.58,
		"overflow-y": "auto",
		"overflow-x": "hidden"
	});
	$(".profile_list>li").css({
		width: $(".con-body-top").width() * 0.8,
		"margin-left": $(".con-body-top").width() * 0.06,
	});
}

function selectProfile() {
	var list = $('.profile_list').find("li");
	var checklist = $(".profile_list").find($("input[type='checkbox']:checked"));
	//	if(checklist.length == 0) {
	//		$("#btn-conn").removeClass("btn-conn");
	//	} else {
	//		$("#btn-conn").addClass("btn-conn");
	//	}
	//获取点击的checkbox
	$("input[type='checkbox']").on('click', function() {
		//判断父级
		if($(this).parents().is(".profile_list")) {
			//判断点击的 checkbox 是否打开
			if(this.checked) {
				$(list).each(function(index, item) {
					var check = $(item).children("input[type='checkbox']")[0];
					if(check.checked) {
						check.checked = false;
					}
				});
				this.checked = true;
				setTimeout(function() {
					$(".stb-profile").addClass("hide-section");
					$(".stb-revolution").removeClass("hide-section");
					stbListInfo();
				}, 1000);
			} else {
				this.checked = false;
			}
		}
	});
}
function addListener(element, e, fn) {
	if(element.addEventListener) {
		element.addEventListener(e, fn, false);
	} else {
		element.attachEvents("on" + e, fn);
	}
}
