var optSex;
	var nums = "First";
$(function() {
	$("#RegisterModal").css({
		"width":"100%",
		"height":"100%"
	});

 mui(".mui-scroll,.menu,.evaluating").on('tap', 'a', function() {
 	var tt = this.id;
	document.location.href = "Revolution.html?nums="+nums;
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
   	var email = $("#Email").val();
   	var name = $("#name").val();
   	var firstName = $("#firstName").val();
   	var age = $("#age").val();
//// 		window.location.href = "Revolution.html?nums="+nums;
// 		this.href = "Revolution.html?nums="+nums;
   })
})