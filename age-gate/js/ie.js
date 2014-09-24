//ensure the curtain always covers the entire page
$(document).ready(function(){
 	resizeCurtain()
	$(window).bind("resize.agegateway", function() {
		resizeCurtain();
	});
})
function resizeCurtain() {
	wh = $("body").height();
	ww = $("body").width();
	$(".curtain").css({
		height: wh, 
		width: 	ww,
		left:0
	});
}
