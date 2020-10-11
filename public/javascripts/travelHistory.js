var date = document.getElementById("date");
var time = document.getElementById("time");
var dateGroup = document.getElementsByClassName("form-group")[0];
var timeGroup = document.getElementsByClassName("form-group")[1];
var dateHelp = document.getElementById("dateHelp");
var timeHelp = document.getElementById("timeHelp");

date.onchange = function(){
	if (date.value != ""){
		dateGroup.className = "form-group";
		dateHelp.innerHTML = "";
	}
}

time.onchange = function(){
	if (time.value != ""){
		timeGroup.className = "form-group";
		timeHelp.innerHTML = "";
	}
}

function checkHistory(){
	if (date.value == ""){
		dateGroup.className += " has-error has-feedback";
		dateHelp.innerHTML = "&#10007; Please enter date";
		document.getElementsByClassName("form-control")[0].focus();
	}
	if (time.value == ""){
		timeGroup.className += " has-error has-feedback";
		timeHelp.innerHTML = "&#10007; Please enter time";
		document.getElementsByClassName("form-control")[1].focus();
	}
	if (date.value == "" || time.value == "")
		return false;
}
