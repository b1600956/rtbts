var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var email = document.getElementById("email");
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var formGroup = document.getElementsByClassName("form-group");
var firstNameGroup = formGroup[0];
var lastNameGroup = formGroup[1];
var emailGroup = formGroup[2];
var passwordGroup = formGroup[3];
var confirmPasswordGroup = formGroup[4];
var inFirstNameHelp = document.getElementById("inFirstNameHelp");
var inLastNameHelp = document.getElementById("inLastNameHelp");
var inPswHelp = document.getElementById("inPswHelp");
var inEmailHelp = document.getElementById("inEmailHelp");
var inConfirmPswHelp = document.getElementById("inConfirmPswHelp");
var invalidFirstName = invalidLastName = invalidEmail = invalidPassword = invalidCPassword = false;
			
firstName.onkeyup = function(){
	if (firstName.value != ""){
		firstNameGroup.className = "form-group";
		inFirstNameHelp.innerHTML = "";
	}
}

lastName.onkeyup = function(){
	if (lastName.value != ""){
		lastNameGroup.className = "form-group";
		inLastNameHelp.innerHTML = "";
	}
}

confirmPassword.onkeyup = function(){
	if (lastName.value != ""){
		confirmPasswordGroup.className = "form-group";
		inConfirmPswHelp.innerHTML = "";
	}
}
			
//validate password to have at least 8 characters with mix of numbers and letters
//else error message appear
var regexPsw = /[A-Za-z]+/;
var regexPsw2 = /[0-9]+/;
var regexPsw3 = /\w{8,}/;
password.onkeyup = function(){
	invalidPsw = !regexPsw.test(password.value) || !regexPsw2.test(password.value) ||
	!regexPsw3.test(password.value)
	if (invalidPsw){
		passwordGroup.className += " has-error has-feedback";
		inPswHelp.style.color = "#ff646d";
		if (password.value.length<8)
			inPswHelp.innerHTML = "&#10007 Please use 6 characters or more for password";
		else
			inPswHelp.innerHTML = "&#10007 Choose a stronger password with a mix of letters and numbers";
		invalidPassword = true;
	}else {
		invalidPassword = false;
		inPswHelp.style.color = "";
		inPswHelp.innerHTML = "Use 8 or more characters with a mix of letters and numbers";
		passwordGroup.className = "form-group";
	}
}
			
var regexEmail = /^\S+@\S+[\.][0-9a-z]+$/;
email.onkeyup = function(){
	if (!regexEmail.test(email.value)){
		emailGroup.className += " has-error has-feedback";
		inEmailHelp.innerHTML = "&#10007 Please follow the format example@email.com";
		inEmailHelp.style.color = "#ff646d";
		invalidEmail = true;
	}else{
		inEmailHelp.innerHTML = "Use the format example@email.com";
		inEmailHelp.style.color = "";
		emailGroup.className = "form-group";
		invalidEmail = false;
	}
}

//sign up function will be called when the sign up button clicked
function signUp(){
	//check if the firstname is blank, if it is, display error message
	if (firstName.value == ""){
		firstNameGroup.className += " has-error has-feedback";
		inFirstNameHelp.innerHTML = "&#10007 Please enter your first name";
		invalidFirstName = true;
	}else
		invalidFirstName = false;
	
	//check if the firstname is blank, if it is, display error message
	if (lastName.value == ""){
		lastNameGroup.className += " has-error has-feedback";
		inLastNameHelp.innerHTML = "&#10007 Please enter your last name";
		invalidLastName = true;
	}else
		invalidLastName = false;
	
	//check if the password is blank, if it is, display error message
	if (password.value == ""){
		passwordGroup.className += " has-error has-feedback";
		inPswHelp.innerHTML = "&#10007 Please enter password";
		inPswHelp.style.color = "#ff646d";
		invalidPassword = true;
	}
	
	//check if the confirmation password is blank, if it is, display error message
	if (confirmPassword.value == ""){
		confirmPasswordGroup.className += " has-error has-feedback";
		inConfirmPswHelp.innerHTML = "&#10007 Please enter confirmation password";
		invalidCPassword = true;
	}else if (confirmPassword.value != password.value){
		confirmPasswordGroup.className += " has-error has-feedback";
		inConfirmPswHelp.innerHTML = "&#10007 Those password didn't match. Please try again";
		invalidCPassword = true;
	}else
		invalidCPassword = false;
	
	if (email.value == ""){
		emailGroup.className += " has-error has-feedback";
		inEmailHelp.innerHTML = "&#10007 Please enter your email";
		inEmailHelp.style.color = "#ff646d";
		invalidEmail = true;
	}

	invalid = [invalidFirstName,invalidLastName,invalidEmail,invalidPassword,invalidCPassword];
	for ( i = 0 ; i < invalid.length; i++){
		if (invalid[i]){
			document.getElementsByClassName("form-control")[i].focus();
			console.log(lastName.value + " " + invalidLastName + " " + firstName.value+" " + invalidFirstName);
			return false;
		}
	}
}
