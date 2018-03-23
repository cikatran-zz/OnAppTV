$(function() {
	$("#picID").attr("src", "img/TROPICALISLAND_42.gif");
	//	var times = setInterval(function() {
	//		$("#picID").attr("src", "TROPICALISLAND_4.png");
	//		setTimeout(function() {
	//			$("#picID").attr("src", "TROPICALISLAND_4.gif");
	//		}, 100);
	//	}, 11300);
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		document.location.href = this.href;
	});
	//slide
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
	})
})