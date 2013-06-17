var h=0, m=0, s=0;
var timer;
function showTime()
{
	var today=new Date();

	if(s>=60){
		s = 0;
		m++;
	}
	if(m>=60){
		m = 0;
		h++;
	}
	$("#clock").text(checkTime(h)+":"+checkTime(m)+":"+checkTime(s));
	s++;
	timer=setTimeout('showTime()',1000);
}
// add a zero in front of numbers<10
function checkTime(i)
{
	if (i<10)
	{
		i="0" + i;
	}
	return i;
}
$(document).ready(function(){
	$("#start").click(function(){
		showTime();
	});
	$("#stop").click(function(){
		h=0; m=0; s=0;
		clearTimeout(timer);
	});
});
