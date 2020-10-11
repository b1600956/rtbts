var routeNum = document.getElementById("routeNo");
var busStop = document.getElementsByClassName("busStopName");
var address = document.getElementsByClassName("address");
var longitude = document.getElementsByClassName("longitude");
var latitude = document.getElementsByClassName("latitude");
var formGroup = document.getElementsByClassName("form-group");
var routeNumGroup = formGroup[0];
var routeNumHelp = document.getElementById("routeNoHelp");
var inBusStopHelp = document.getElementsByClassName("inBusStopHelp");
var inAddressHelp = document.getElementsByClassName("inAddressHelp");
var routeLineNum = 0;
checkBusStopField(routeLineNum);
invalidRouteNum = false;
var invalidAddress = invalidBusStop = false;
var count = 1;
var markerList = []; 
var map;
var geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 3.110050, lng: 101.583},
        zoom: 8
    });
	geocoder = new google.maps.Geocoder();
}

routeNum.onkeyup = function(){
	if (routeNum.value != ""){
		routeNumGroup.className = "form-group mt-4";
		routeNumHelp.innerHTML = "";
	}
}

function setInvalidRouteNum(bool){
	invalidRouteNum = bool;
}

function checkBusStopField(index){
	//console.log("testing"+index);
	busStop[index].onkeyup = function(){
		if (busStop[index].value != ""){
			formGroup[index+1].className = "form-group";
			inBusStopHelp[index].innerHTML = "";
		}
	}
	
	address[index].onkeyup = function(){
		if(address[index].value != ""){
			formGroup[index+1].className = "form-group";
			inAddressHelp[index].innerHTML = "Please check on map and adjust the marker to the precise location by dragging it";
			inAddressHelp[index].style.color = "grey";
		}
	}
}

function routeLine_fields() {
    var parentBox = document.getElementsByClassName('busLine')[0];
	if(validateBusLine(0)){
		routeLineNum++;
		var divtest = document.createElement("div");
		divtest.setAttribute("class", "bg-light mt-3 busStop");
		divtest.innerHTML = 
		"<div class = \"form-group\">"+
		"<label for=\"defaultSelect\">Bus Stop "+(routeLineNum+1)+"</label>"+
		"<input type=\"text\" class=\"form-control busStopName\" name=\"busStop[]\" placeholder=\"Name / Landmark*\">"+
		"<small class=\"form-text inBusStopHelp mb-4\"></small>"+
		"<textarea class=\"form-control address\" name=\"address[]\" placeholder=\"Address*\" rows=\"2\"></textarea>"+
		"<small class=\"form-text inAddressHelp\">Please check on the map and adjust by dragging the marker accordingly</small>"+
		"<button type=\"button\" class=\"btn mt-4\" onclick=\"checkOnMap("+routeLineNum+")\">Check on the map</button>"+
		"<input type=\"text\" class=\"form-control d-none latitude\" name = \"latitude[]\" placeholder=\"Latitude\">"+
		"<input type=\"text\" class=\"form-control d-none longitude\" name = \"longitude[]\" placeholder=\"Longitude\">"+
		"</div>";
		parentBox.insertBefore(divtest,document.getElementsByClassName("busStop")[0]);
		//console.log("routeLineNum"+routeLineNum);
	}
}
/*
function remove_routeLine_fields(rid) {
	$('#routeRow'+rid).remove();
}*/

function checkOnMap(num){
	if (num < routeLineNum || validateBusStop(0)){
		var index = routeLineNum - num;
		//console.log("num = "+num +" , index = "+ index);
		var location = busStop[index].value.trim() + " " + address[index].value.trim();
		//console.log("location = "+location);
		geocoder.geocode({ 'address': location }, function (results, status) {
			//console.log(results);
			if(results.length <= 0){
				formGroup[index+1].className += " has-error has-feedback";
				inAddressHelp[index].innerHTML = "&#10007 Your address is not found on the map! Please ensure the correct address is entered";
				inAddressHelp[index].style.color = "#ff646d";
			}else{
				//console.log(results);
				var latLng = {lat: results[0].geometry.location.lat (), lng: results[0].geometry.location.lng ()};
				//console.log (latLng);
				if (status == 'OK') {
					map.setCenter(latLng);
					map.setZoom(17);
					var marker;
					//console.log("marker List " + markerList);
					//console.log("longitude " +longitude[index].value);
					//console.log("index " +index+" boolean "+ (index == 0 && longitude[index].value == ""));
					if (index == 0 && longitude[index].value == ""){
						//console.log("nono");
						marker = new google.maps.Marker({
							position: latLng,
							map: map,
							draggable:true,
							label: count+""
						});
						google.maps.event.addListener(marker, 'dragend', function(markerEvent){
							var markerIndex = marker.getLabel();
							var inputIndex = routeLineNum + 1 - markerIndex;
							//console.log("index " +markerIndex+ " inputIndex " + inputIndex);
							//console.log("marker longitude "+markerEvent.latLng.lng());
							//console.log(marker.getLabel()+"haha");
							longitude[inputIndex].value = markerEvent.latLng.lng();
							latitude[inputIndex].value = markerEvent.latLng.lat();
							//console.log("input longitude "+longitude[inputIndex].value);
							//console.log("first longitude "+longitude[1].value);
						});
						//console.log("markList size " + markerList.length); 
						markerList.push(marker);
						marker.setMap(map);
						//console.log("markList size " + markerList.length);
						count++;
					}else{
						marker = markerList[num];
						//console.log("marker"+marker);
						marker.setPosition(latLng);
						//console.log("latLng "+latLng);
						//console.log("markerList "+ markerList[num].position.lat()+" "+markerList[num].position.lng());
					}
					longitude[index].value = marker.position.lng();
					latitude[index].value = marker.position.lat();
					//console.log (map);
				
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			}
		});
	}
}

function validateBusStop(index){
	if (busStop[index].value == ""){
		formGroup[index+1].className += " has-error has-feedback";
		inBusStopHelp[index].innerHTML = "&#10007 Please enter the bus stop name";
		inBusStopHelp[index].style.color = "#ff646d";
		invalidBusStop = true;
		busStop[index].focus();
	}else
		invalidBusStop = false;
	if (address[index].value == ""){
		formGroup[index+1].className += " has-error has-feedback";
		inAddressHelp[index].innerHTML = "&#10007 Please enter the bus stop address";
		inAddressHelp[index].style.color = "#ff646d";
		invalidAddress = true;
		if (!invalidBusStop)
			address[index].focus();
	}else
		invalidAddress = false;
	
	if(invalidBusStop || invalidAddress){
		checkBusStopField(index);
		return false;
	}else{
		formGroup[index+1].className = "form-group";
		inAddressHelp[index].innerHTML = "Please check on map and adjust the marker to the precise location by dragging it";
		inAddressHelp[index].style.color = "grey";
		inBusStopHelp[index].innerHTML = "";
	}
	return true;
}

function validateBusLine(index){
	if(validateBusStop(index)){
		if(longitude[index].value == "" || latitude[index].value == ""){
			formGroup[index+1].className += " has-error has-feedback";
			inAddressHelp[index].innerHTML = "&#10007 Please check on map and adjust the marker to the precise location by dragging it";
			inAddressHelp[index].style.color = "#ff646d";
			invalidAddress = true;
		}else
			return true;
	}
	return false;
}

function addRoute(){
	if (routeNum.value == ""){
		routeNumGroup.className += " has-error has-feedback";
		routeNumHelp.innerHTML = "&#10007 Please enter the route number";
		routeNumHelp.style.color = "#ff646d";
		invalidRouteNum = true;
		routeNum.focus();
	}//else
		//invalidRouteNum = false;
	for (j = 0; j <= routeLineNum; j++){
		if(validateBusLine(j) == false)
			invalidBusStop = true;
	}
	if (invalidRouteNum || invalidBusStop){
		if(invalidRouteNum){
			routeNum.focus();
		}
		return false;
	}/**
	for (j = markerList.length-1, k = 0; j >= 0 ; j--, k++){
		alert(markerList[j].position.lat()+" "+markerList[j].position.lng()+" field "+ latitude[k].value + " "+longitude[k].value);
	}**/
}