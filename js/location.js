/* 	
 *	Geolocation Logic
 *	Danny Wilson
 */
// global variables
var locations = [];
var watch = null;
// dom event handlers
$(document).ready(function () {

	//start watching the user location
	$("#start").click(function () {
		locations = [];
		watch = getLocation();
	});

	//stop tracking the location and record the distance
	$("#stop").click(function () {
		navigator.geolocation.clearWatch(watch);
		var distance = calculateDistance(locations);
		console.log(distance);
		if(distance > 0){
			alert('Save this value: ' + distance);
		} else {
			alert('You didn\'t move. Stop being lazy!');
		}
	});
});

//returns a watchlocation object
function getLocation() {

	var success = function (position) {
		locations.push(position.coords);
		var distance = calculateDistance(locations).toFixed(3) + "km";
		$("#distance .value").text(distance);
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