var busNum = document.getElementById("busNo");
var busCap = document.getElementById("busCap");
var contactNum = document.getElementById("contactNum");
var busNumGroup = document.getElementsByClassName("form-group")[0];
var busCapGroup = document.getElementsByClassName("form-group")[2];
var contactNumGroup = document.getElementsByClassName("form-group")[3];
var busNumHelp = document.getElementById("busNoHelp");
var busCapHelp = document.getElementById("busCapHelp");
var contactNumHelp = document.getElementById("contactNumHelp");
var invalidContactNum = invalidBusNum = invalidBusCap = false;


busNum.onkeyup = function(){
	if (busNum.value != ""){
		busNumGroup.className = "form-group mt-4";
		busNumHelp.innerHTML = "";
	}
}

busCap.onkeyup = function(){
	if (busCap.value != ""){
		busCapGroup.className = "form-group";
		busCapHelp.innerHTML = "";
	}
}

var regexContactNum = /[0-9]{3}-[0-9]{7,}/;
contactNum.onkeyup = function(){
	if (!regexContactNum.test(contactNum.value)){
		contactNumGroup.className += " has-error has-feedback";
		contactNumHelp.innerHTML = "&#10007 Please follow the format 012-3456789";
		contactNumHelp.style.color = "#ff646d";
		invalidContactNum = true;
	}else{
		contactNumHelp.innerHTML = "Use the format 012-3456789";
		contactNumHelp.style.color = "";
		contactNumGroup.className = "form-group";
		invalidContactNum = false;
	}
}

function addBus(){
	if (busNum.value == ""){
		busNumGroup.className += " has-error has-feedback";
		busNumHelp.innerHTML = "&#10007 Please enter the bus plate number";
		busNumHelp.style.color = "#ff646d";
		invalidBusNum = true;
	}else
		invalidBusNum = false;
	if (busCap.value == ""){
		busCapGroup.className += " has-error has-feedback";
		busCapHelp.innerHTML = "&#10007 Please enter the bus captain name";
		busCapHelp.style.color = "#ff646d";
		invalidBusCap = true;
	}else
		invalidBusCap = false;
	if (contactNum.value == "" || (!regexContactNum.test(contactNum.value))){
		contactNumGroup.className += " has-error has-feedback";
		contactNumHelp.innerHTML = "&#10007 Please enter the contact number";
		contactNumHelp.style.color = "#ff646d";
		invalidContactNum = true;
	}
	if(invalidBusNum){
		document.getElementsByClassName("form-control")[0].focus();
		return false;
	}else if(invalidBusCap){
		document.getElementsByClassName("form-control")[2].focus();
		return false;
	}else if(invalidContactNum){
		document.getElementsByClassName("form-control")[3].focus();
		return false;
	}
	
}