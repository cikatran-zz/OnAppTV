var startY;
var moveY;

//获取屏幕的高度
var Height;
$(function() {
	Height = $(window).height();
	mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
		var thisID = this.id;
		if(thisID == "dismiss")
		{
			document.location.href = "Login.html";
		}else if(thisID == "loginButton"){
			document.location.href = "Register.html";
		}
		
	});
	//footer height
	var topheight = $(".modal-header").outerHeight();
	//	console.log(topheight);
	var bodyheight = $(".modal-body").outerHeight();
	//	console.log(bodyheight);
	$(".modal-footer").css({
		"height":Height-topheight-bodyheight,
		"top":topheight+bodyheight,
		"position":"absolute"
	});
	$(".imgbg").height(Height-topheight-bodyheight);
    $(".SelectList").height(Height-topheight-bodyheight);

	//增加滑动手势
	//	1.开始滑动
	$(".modal-footer").on("touchstart", function(e) {
		startY = e.originalEvent.changedTouches[0].pageY;
	})
	//  2.滑动移动
	$(".modal-footer").on("touchmove", function(e) {
		moveY = e.originalEvent.changedTouches[0].pageY;
		var y = startY - moveY;
		if(y > 0) {
			//获取footer的高度
			var foot = $(this).height();
			//footer的高度小于屏幕的高度
			if(foot + y < Height) {
				$(this).css({
					"height": foot + y,
					"top": Height - y - foot,
					"position": "absolute",
					"z-index":"100"

				})
				$(this).height(foot + y);
//				$(".imgbg").height(foot + y);
$(".imgbg").css({
				"height": foot+y,
				"background-size":"100% "
			});
               
			} else {
				$(this).css({
					"height": Height,
					"top": 0,
					"position": "absolute",
					"z-index":"100"
				})
				$(".imgbg").css({
				"height": Height,
				"background-size":"100% 100%"
			});
               
			}
			$(".SelectList").css("bottom", 0);
		} else {
			//获取footer的高度
			var foot = $(this).height();
			//判断footer的位置
			if(Height - foot < Height -topheight-bodyheight) {
				//footer占据整个界面时
				//判断是否已经存在关闭按钮，如果存在就删除
				var dom = document.getElementById("CloseModal");
				if(dom) {
					dom.parentNode.removeChild(dom);
				}
				//显示header中的关闭按钮
				$("#dismiss").css("display", "block");
				//判断下滑
				if(foot + y > Height-topheight-bodyheight) {
					$(this).css({
						"height": Height + y,
						"position": "absolute",
						"top": -y,
						"z-index":"100"
					})
					$(".imgbg").css({
				"height": Height + y,
				"background-size":"100% auto"
			});
               
				} else {
					$(this).css({
						"height": Height-topheight-bodyheight,
						"position": "relative",
						"top": 0,
						"z-index":"100"
					})
//					$(".imgbg").css("height", Height-topheight-bodyheight);
$(".imgbg").css({
				"height": Height-topheight-bodyheight,
				"background-size":"100% auto"
			});
               
				}
				$(".SelectList").css("bottom", 0);
			}
		}
	})
	//	3.滑动结束
	$(".modal-footer").on("touchend", function(e) {
		var footer = $(this).height();
		//判断界面
		if(Height - footer > 50) {
			var foot = Height-topheight-bodyheight;
			$(this).css({
				"height": foot,
				"position": "absolute",
				"top": topheight+bodyheight,
				"z-index":"1"
			})
			$(".imgbg").css({
				"height": foot,
				"background-size":"100% auto"
			});
               
		} else {
			$(this).css({
				"height": Height,
				"top": "0",
				"position": "absolute",
				"z-index":"100"
				
			})
			$(".imgbg").css({
				"height": Height,
				"position":"absolute",
				"top":0,
				"bottom":0,
				"background-size":"100% 100%"
			});
//			alert( Height +"比较"  + $(".imgbg").height());
		//	判断是否已经存在关闭按钮，如果存在就删除
			var dom = document.getElementById("CloseModal");
			//隐藏header中的关闭按钮
			$("#dismiss").css("display", "none");
			if(dom) {
				dom.parentNode.removeChild(dom);
			}
			closeHTML = '<a href="#"  id="CloseModal" onclick="CloseModal()"  class="close"></a>';
			$(".modal-footer").append(closeHTML);

		}
		$(".SelectList").css("bottom", 0);
	})
})

function CloseModal() {
	var dom = document.getElementById("CloseModal");
	if(dom) {
		dom.parentNode.removeChild(dom);
	}
	var topheight = $(".modal-header").outerHeight();
	//	console.log(topheight);
	var bodyheight = $(".modal-body").outerHeight();
	//显示header中的关闭按钮
	$("#dismiss").css("display", "block");
	var footerheight = Height-topheight-bodyheight;
	$(".modal-footer").css({
		"height": footerheight,
		"position": "absolute",
		"top": topheight+bodyheight
	})
//	$(".imgbg").css("height", footerheight);
$(".imgbg").css({
				"height": footerheight,
				"background-size":"100% auto"
			});
               

}
//返回到登录界面
//function dismissModal() {
//	document.location.href = "Login.html";
//}
