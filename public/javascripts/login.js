var email = document.getElementById("email");
var password = document.getElementById("password");
var emailGroup = document.getElementsByClassName("form-group")[0];
var passwordGroup = document.getElementsByClassName("form-group")[1];
var emailHelp = document.getElementById("emailHelp");
var passwordHelp = document.getElementById("passwordHelp");

email.onkeyup = function(){
	if (email.value != ""){
		emailGroup.className = "form-group mt-4";
		emailHelp.innerHTML = "";
	}
}

password.onkeyup = function(){
	if (password.value != ""){
		passwordGroup.className = "form-group";
		passwordHelp.innerHTML = "";
	}
}

function signIn(){
	var invalidEmail = invalidPassword = false;
	if (email.value == ""){
		emailGroup.className += " has-error has-feedback";
		emailHelp.innerHTML = "&#10007; Please enter your email";
		invalidEmail = true;
	}else
		invalidEmail = false;
	if (password.value == ""){
		passwordGroup.className += " has-error has-feedback";
		passwordHelp.innerHTML = "&#10007; Please enter your password";
		invalidPassword = true;
	}else
		invalidPassword = false;
	invalid = [invalidEmail, invalidPassword];
	for ( i = 0 ; i < invalid.length; i++){
		if (invalid[i]){
			document.getElementsByClassName("form-control")[i].focus();
			return false;
		}
	}
}
