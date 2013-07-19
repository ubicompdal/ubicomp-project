var h=0, m=0, s=0, ms=0;
var timer;

var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		// Public methods
		// Start or resume
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
	};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

function show() {
	
	$time = document.getElementById('time');
	
	update();
}

function update() {
	
	$time.innerHTML ="<i class=icon-time></i>" + " "+formatTime(x.time());
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
}



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
	var temp= $("#time").text(checkTime(h)+":"+checkTime(m)+":"+checkTime(s)+"."+checkTime(ms));
	ms++;
	timer=setInterval('showTime()', 10);
	
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
var count=0;

$(document).ready(function(){
document.getElementById("start").value="Start";

$("#reset").hide();
	$("#start").click(function(){
	
clocktimer = setInterval("update()", 1);
	x.start();
		$(this).hide();
		 $("#stop").show(); 
		 $("#reset").show();
		 $("#stop").css("width","50%");
			
	});
	$("#stop").click(function(){        
	document.getElementById("start").value="Restart";
        App.triggerEvent("stop:clock", getTimeInMilliseconds(h, m, s, ms));        		
		stop();		
		$(this).hide();
		$("#start").show();
		
		$("#reset").show();
		$("#start").css("width","50%");
	
	});
	$("#reset").click(function(){
	
	document.getElementById("start").value="Start";
	$("#start").show();
	$(this).hide();
	$("#stop").hide();
	h=0;m=0;s=0;
	reset();	
	$("#time").text("00"+":"+"00"+":"+"00"+"."+"00");
	$("#start").css("width","100%");
	});
	
});
