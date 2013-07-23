var startTime;
var timer;
var total;
var running = false;
//show the amount of time since startTime
function showTime(){
	var date1 = startTime;
	var date2 = new Date();
	if (date2 < date1) {
		date2.setDate(date2.getDate() + 1);
	}
	var msec = date2 - date1;
	total = msec;
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(msec / 1000);
	msec -= ss * 1000;
	$("#clock .value").text(pad(hh,2)+":"+pad(mm,2)+":"+pad(ss,2)+"."+pad(msec,3));
}

function pad(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

$(document).ready(function(){
	$("#start").click(function(){
		running = true;
		startTime = new Date();
		timer = setInterval(showTime, 100);
		$("#stop").show();
		$(this).hide();
	});
	$("#stop").click(function(){
		App.triggerEvent("stop:clock", total);
		running = false;
		clearInterval(timer);
		$("#start").show();
		$(this).hide();
	});
});

$(window).bind("beforeunload",function(event) {
	if(running)
		return "You have unsaved changes";
});
