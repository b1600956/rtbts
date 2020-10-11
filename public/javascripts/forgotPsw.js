var email = document.getElementById("email");
var emailGroup = document.getElementsByClassName("form-group")[0];
var inEmailHelp = document.getElementById("inEmailHelp");

email.onkeyup = function(){
	if (email.value != ""){
		emailGroup.className = "form-group mt-5";
		inEmailHelp.innerHTML = "";
	}
}

function signIn(){
	if (email.value == ""){
		emailGroup.className += " has-error has-feedback";
		inEmailHelp.innerHTML = "&#10007; Please enter your email";
		email.focus();
		return false;
	}
}
