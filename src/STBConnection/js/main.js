var flag = false;
var nY = 0;
$(function() {
	$("#picID").attr("src", "img/TROPICALISLAND_42.gif");
	var mySwiper = new Swiper('.swiper-container', {
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
/**
 * java 和 js 连接的桥梁
 * @param {Object} callback
 */
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
