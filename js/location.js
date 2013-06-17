//danny
var locations = [];
$(document).ready(function(){
	var running = null;
	$("#start").click(function(){
		locations = [];
		running = setInterval(function () {
			getLocation()
		}, 1000);
	});

	$("#stop").click(function(){
		alert('Save this value: ' + calculateDistance());
		clearInterval(running);
	});
});

function getLocation(){
	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(
		                                         function(position) {
		                                         	locations.push(position.coords);
		                                         	$("#distance").text(calculateDistance().toFixed(3) + "km");
		                                         	console.log(position.coords);
		                                         },
		                                         function(){
		                                         	console.error('error');
		                                         },
		                                         {
		                                         	enableHighAccuracy: true,
		                                         	timeout: timeoutVal,
		                                         	maximumAge: 0
		                                         });
	}
	else {
		alert("Geolocation is not supported by this browser");
	}
}

function calculateDistance(){
	var total = 0;
	var last = null;
	for (var i = 0; i < locations.length - 1; i++) {
		var lat1 = locations[i].latitude;
		var lon1 = locations[i].longitude;
		var lat2 = locations[i+1].latitude;
		var lon2 = locations[i+1].longitude;
		total += getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
		console.log(total);
	};
	return total;
}
//calculates great-circle distances between the two points – that is,
//the shortest distance over the earth’s surface – using the ‘Haversine’ formula.
//http://stackoverflow.com/a/27943
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}
