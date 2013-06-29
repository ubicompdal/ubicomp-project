var h=0, m=0, s=0, ms=0;
var timer;
function showTime()
{
	var today=new Date();
	if(ms>=100){
		ms = 0;
		s++;
	}
	if(s>=60){
		s = 0;
		m++;
	}
	if(m>=60){
		m = 0;
		h++;
	}
	$("#clock .value").text(checkTime(h)+":"+checkTime(m)+":"+checkTime(s)+"."+checkTime(ms));
	ms++;
	timer=setTimeout('showTime()', 10);
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
		$(this).hide();
		$("#stop").show();
	});
	$("#stop").click(function(){        
        App.triggerEvent("stop:clock", getTimeInMilliseconds(h, m, s, ms));        
		h=0; m=0; s=0;
		clearTimeout(timer);
		$(this).hide();
		$("#start").show();
	});
});
