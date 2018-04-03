var optSex;
	var nums = "First";

function validateInput(elementID) {
    if (!document.getElementById(elementID).checkValidity()) {
        $("#"+elementID).css("border", "1px solid #ff0000")
		$("#errorMessage").text(document.getElementById(elementID).validationMessage);
        return false;
    }
    $("#errorMessage").text("")
    $("#"+elementID).css("border", "1px solid rgba(222, 222, 222, 1)")
    return true;
}
$(function() {
	$("#RegisterModal").css({
		"width":"100%",
		"height":$(window).height()
	});

 mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
 	// var id = this.id;
	// document.location.href = "Revolution.html?nums="+nums;
	 if (this.id == "Validate") {

         if (!validateInput("Email") || !validateInput("name") || !validateInput("firstName") || !validateInput("age")) {
         	return;
		 }
         var email = $("#Email").val();
         var name = $("#name").val();
         var firstName = $("#firstName").val();
         var age = $("#age").val();
	 }
	});
	//移除遮罩效果
	$(".modal-backdrop").remove();
    //弹出窗口
    $("#faceBookLogin").click(function(){
    	$("#facebookModal").modal({
    	   	keyboard:true
    	   })
    	//增加一层遮罩效果
    	$("#facebookModal").before('<div class="mask"></div>');
    })
    //关闭
    $("#closeModal").click(function(){
    	  this.href = "SignIn.html";
    })
// //点击ALLow跳转
// $("#Agreed").click(function(){
// 	this.href = "Revolution.html?nums="+nums;
// })
// //点击Disagree
// $("#Disagree").click(function(){
// 		this.href = "Revolution.html?nums="+nums;
// })
   //选则单选按钮
   $(".opt").click(function(){
   	  //判断是否已经选中
   	  if( $(this).find("input")[0].checked){
   	  	return;
   	  }else{
   	  	//获取同级元素
   	  	var opt = $(".opt");
   	  	for(var i=0;i<opt.length;i++){
   	  		//设置所有input的checked为false
   	  		opt[i].children.sex.checked = false;
   	  	}
   	  	//设置点击的input的checked为true
   	  	$(this).find("input")[0].checked = true;
   	  	//值
   	  	optSex = $(this).find("label").html();
   	  }
   })

     //获取单选按钮的值
     var optArray = $(".opt");
     for(var i=0;i<optArray.length;i++){
     	//判断radio是否选中
     	if(optArray[i].children.sex.checked){
     		optSex = optArray[i].children.sex.value;	
     	}
     }
      //年龄下拉框(计算100岁之内的)
    var nowDate = new Date();
    var ageSelect = $("#age");
    for(var year = 1;year < 150; year++){
    	  var options = document.createElement('option');
    	  options.value = year;
    	  var txt = document.createTextNode( year + " Years ");
    	  options.appendChild(txt);
    	  $(ageSelect).append(options);
    }
    
   
   //验证输入的有效性
   $("#Validate").click(function(){

//// 		window.location.href = "Revolution.html?nums="+nums;
// 		this.href = "Revolution.html?nums="+nums;
   })
})

$(document).ready(function(){
    $("div#spinner").hide();
});

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
    bridge.registerHandler('HIG_SignUpCallback', function(data, responseCallback) {
        $("div#spinner").hide();
        var feedback = JSON.parse(data);
        if (!feedback.success) {
            $("p#errorMessage").text(feedback.error);
            $("input#email").css("border", "1px solid #ff0000");
            $("input#password").css("border", "1px solid #ff0000");
        } else {
            document.location.href = "Revolution.html";
        }
    });
})