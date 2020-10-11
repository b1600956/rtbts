var geocoder;
var map;
var directionsDisplay;
var directionsService;
var busStops = [
  ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  ['Bondi Beach', -33.890542, 151.274856, 4],
  ['Coogee Beach', -33.923036, 151.259052, 5],
  ['Maroubra Beach', -33.950198, 151.259302, 1],
  ['Cronulla Beach', -34.028249, 151.157507, 3]
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 3.110050, lng: 101.583},
        zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    });
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
}

function displayRoute(busStops) {
/*
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(-33.92, 151.25),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });*/
  var infowindow = new google.maps.InfoWindow();
  var marker, i;
  var request = {
    travelMode: google.maps.TravelMode.DRIVING
  };
  console.log("abc");
  for (i = 0; i < busStops.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(busStops[i][2], busStops[i][3])
    });
	google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
		 console.log("okkkkk");
         infowindow.setContent(busStops[i][0]);
         infowindow.open(map, marker);
     }
	})(marker, i));
    if (i == 0) 
		request.origin = marker.getPosition();
    else if (i == busStops.length - 1) 
		request.destination = marker.getPosition();
    else {
      if (!request.waypoints) 
		  request.waypoints = [];
      request.waypoints.push({
        location: marker.getPosition(),
        stopover: true
      });
    }
  }
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}
//google.maps.event.addDomListener(window, "load", displayRoute);