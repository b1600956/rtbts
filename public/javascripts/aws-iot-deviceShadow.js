var awsIot = require('aws-iot-device-sdk');  
const NODE_ID = 'Pi3-DHT11-Node'; 
const INIT_DELAY = 15; 
const TAG = '[' + NODE_ID + '] >>>>>>>>> '; 

var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 3.110050, lng: 101.583},
  zoom: 10
});
var mark;
var lat;
var lng;
console.log(TAG, 'Connecting...'); 

var thingShadow = awsIot.thingShadow({ 
  keyPath: 'C:/Users/user/rtbts-demo/rtbts/public/certs/5a553074b9-private.pem.key', 
  certPath: 'C:/Users/user/rtbts-demo/rtbts/public/certs/5a553074b9-certificate.pem.crt', 
  caPath: 'C:/Users/user/rtbts-demo/rtbts/public/certs/rootCA.pem', 
  clientId: NODE_ID, 
  host: 'a2pg831a2zywmf-ats.iot.us-east-1.amazonaws.com', 
  port: 8883, 
  region: 'us-east-1', 
  debug: true, // optional to see logs on console 
}); 
 
thingShadow.on('connect', function() { 
  console.log(TAG, 'Connected.'); 
  thingShadow.register("bus", {}, function() { 
    console.log(TAG, 'Registered.'); 
    console.log(TAG, 'Reading data in ' + INIT_DELAY + ' seconds.'); 
    setTimeout(sendData, INIT_DELAY * 1000); // wait for `INIT_DELAY` seconds before reading the first record 
  }); 
}); 
 
function sendData() { 
  var clientTokenUpdate = thingShadow.get("bus"); 
  if (clientTokenUpdate === null) { 
    console.log(TAG, 'Shadow get failed, operation still in progress'); 
  } else { 
    console.log(TAG, 'Shadow get success.'); 
  } 
 
  // keep sending the data every 30 seconds 
  console.log(TAG, 'Reading data again in 30 seconds.'); 
  setTimeout(sendData, 10000); // 30,000 ms => 30 seconds 
} 
 
thingShadow.on('status', function(thingName, stat, clientToken, stateObject) { 
  console.log('received ' + stat + ' on ' + thingName + ':', stateObject); 
  if(stat == "accepted"){
	  updateLocation(stateObject);
  }
}); 
 
thingShadow.on('delta', function(thingName, stateObject) { 
  console.log('received delta on ' + thingName + ':', stateObject); 
}); 
 
thingShadow.on('timeout', function(thingName, clientToken) { 
  console.log('received timeout on ' + thingName + ' with token:', clientToken); 
});

function updateLocation(stateObject){
 	lat = stateObject.state.reported.latitude;
 	lng = stateObject.state.reported.longitude;
 	map.setCenter({lat:lat, lng:lng, alt:0});
 	mark.setPosition({lat:lat, lng:lng, alt:0});
}