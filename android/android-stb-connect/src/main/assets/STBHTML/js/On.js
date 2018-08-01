// window.onclick = function(){
// 	window.location.href = 'Welcome.html';
// }
// window.ontouchend = function(){
// 	window.location.href = 'Welcome.html';
// }
$(function() {
	$("body").focus(function(event) {
		$("div").css({
			color: '#888888',
			background: '#FC355B'
		});
	});
})