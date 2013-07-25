/*
 *	Geolocation Logic
 *	Danny Wilson
 */
// global variables
var locations = [];
var watch = null;
// dom event handlers
$(document).ready(function () {

    //stop tracking the location and record the distance
    App.addEvent("stop:clock", function(time){
    	navigator.geolocation.clearWatch(watch);
    	var distance = calculateDistance(locations);
    	var clk = $('#clock .value').text().split(':');
    	var seconds = parseInt(clk[0] * 3600) + parseInt(clk[1] * 60) + parseInt(clk[2]);

		//distance is in km and time is in seconds
		var meters = distance*1000;
		var speed = meters / seconds;
		//if the speed is over 10m/s, they are cheaters.
		var cheating = speed > 10;
		//disable cheating
		var cheating = false;
		if(distance > 0 && !cheating){
			App.triggerEvent("save:distance", { distance: distance, deltaTime: time, date: new Date() } );
		} else {
			alert('You didn\'t move or you were cheating. Don\'t be lazy!');
		}
	});
    $("#start").click(function () {
		//reset the location array
		locations = [];
		watch = getLocation();
		$("#distance .value").text(calculateDistance(locations).toFixed(3) + "km");
	});
	//start getting geolocation immediately
	watch = getLocation();
});

//returns a watchlocation object
function getLocation() {
	var success = function (position) {
		locations.push(position.coords);
		//if we are running, calculate the distance
		if(running){
			var distance = calculateDistance(locations).toFixed(3) + "km";
			$("#distance .value").text(distance);
		}
	};
	var error = function (error) {
		alert('Error getting geolocation: ' + error.message);
	};
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	if (navigator.geolocation) {
		return navigator.geolocation.watchPosition(success, error, options);
	} else {
		alert("Geolocation is not supported by this browser");
		return null;
	}
}

//calculate the distance travelled in a list of locations
function calculateDistance(locations) {
	//if we have less than 2 locations
	//then we have not moved
	if(locations.length < 2){
		return 0;
	}
	var total = 0;
	//add the distance between each location
	for (var i = 0; i < locations.length - 1; i++) {
		var lat1 = locations[i].latitude;
		var lon1 = locations[i].longitude;
		var lat2 = locations[i + 1].latitude;
		var lon2 = locations[i + 1].longitude;
		total += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
	};
	return total;
}

//calculates great-circle distances between the two points – that is,
//the shortest distance over the earth’s surface – using the ‘Haversine’ formula.
//http://stackoverflow.com/a/27943
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
	Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}
