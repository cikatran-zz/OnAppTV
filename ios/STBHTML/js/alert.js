(function () {  
    $.MsgBox = {  
        Alert: function (title, msg) {  
            GenerateHtml("alert", title, msg);  
            btnOk();  //alert只是弹出消息，因此没必要用到回调函数callback  
            btnNo();  
        },  
        Confirm: function (title, msg, callback) {  
            GenerateHtml("confirm", title, msg);  
            btnOk(callback);  
            btnNo();  
        }  
    }  
    //生成Html  
    var GenerateHtml = function (type, title, msg) {  
        var _html = "";  
        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';  
        _html += '<a id="mb_ico" class="close"></a><div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';  
        if (type == "alert") {  
            _html += '<button id="mb_btn_ok" type="button">Sure</button>';  
        }  
        if (type == "confirm") {  
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';  
            _html += '<input id="mb_btn_no" type="button" value="取消" />';  
        }  
        _html += '</div></div>';  
        //必须先将_html添加到body，再设置Css样式  
        $("body").append(_html);   
        //生成Css  
         GenerateCss();  
    }  
  
    //生成Css  
    var GenerateCss = function () {  
        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',  
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'  
        });  
        $("#mb_con").css({ zIndex: '999999', width: '6.5rem', position: 'fixed',  
            backgroundColor: 'White', borderRadius: '15px'  
        });  
        $("#mb_tit").css({ display: 'block', fontSize: '.48rem', color: '#444', padding: '10px 15px',  
            backgroundColor: '#DDD', borderRadius: '15px 15px 0 0',  
            borderBottom: '3px solid #009BFE', fontWeight: 'bold'  
        });  
        $("#mb_msg").css({ padding: '20px', lineHeight: '.4rem',  
            borderBottom: '1px dashed #DDD', fontSize: '.45rem'  
        });  
        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '5px', top: '5px',  textAlign: 'center', width:"10px",height:"10px",
            lineHeight: '16px', borderRadius: '20px' 
        });  
        $(".close").css({right:"0.5rem",position:"absolute","margin-top":'5px'});
        $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'center'});  
        $("#mb_btn_ok,#mb_btn_no").css({ width: '2.667rem', height: '0.8rem', fontSize:".377rem",color: 'black', border: 'none'});  
        $("#mb_btn_ok").css({ backgroundColor: '#FC355B',"border-radius":"30px","outline":"none"});  
        $("#mb_btn_no").css({ backgroundColor: 'gray', marginLeft: '20px' });  
//      //右上角关闭按钮hover样式  
//      $("#mb_ico").hover(function () {  
//          $(this).css({ backgroundColor: 'Red', color: 'White' });  
//      }, function () {  
//          $(this).css({ backgroundColor: '#DDD', color: 'black' });  
//      });  
        var _widht = document.documentElement.clientWidth;  //屏幕宽  
        var _height = document.documentElement.clientHeight; //屏幕高  
        var boxWidth = $("#mb_con").width();  
        var boxHeight = $("#mb_con").height();  
        //让提示框居中  
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });  
    }  
    //确定按钮事件  
    var btnOk = function (callback) {  
        $("#mb_btn_ok").click(function () {  
            $("#mb_box,#mb_con").remove();  
            if (typeof (callback) == 'function') {  
                callback();  
            }  
        });  
    }  
    //取消按钮事件  
    var btnNo = function () {  
        $("#mb_btn_no,#mb_ico").click(function () {  
            $("#mb_box,#mb_con").remove();  
        });  
    }  
})();  