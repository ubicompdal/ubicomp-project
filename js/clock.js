var startTime, timer;
function start()
{
	var startTime = new Date();
	timer=setTimeout('showTime()', 10);
}
function showTime(){
	var date1 = startTime;
	var date2 = new Date();
	if (date2 < date1) {
		date2.setDate(date2.getDate() + 1);
	}
	var diff = date2 - date1;

	var msec = diff;
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(msec / 1000);
	msec -= ss * 1000;
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
