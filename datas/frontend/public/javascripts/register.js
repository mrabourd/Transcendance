
var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// var buttonOn = false;
// var buttonRegister = document.getElementById("button");

document.getElementById("form3Example3c").oninput = function (){checkEmail ()};
document.getElementById("form3Example4cd").oninput = function () {checkPasswords ()}; 

function checkEmail () {
	let inputEmail = document.getElementById("form3Example3c").value;
	
	if (inputEmail.match(EMAIL_REGEX) )
	document.getElementById("checkMail").innerHTML = "";
else{
	document.getElementById("checkMail").innerHTML = "Wrong email address";
	// buttonOn = false
}
}

function checkPasswords () {
	let pass1 = document.getElementById("form3Example4c").value;
	let pass2 = document.getElementById("form3Example4cd").value;
	
	if (pass1 === pass2){
		document.getElementById("checkPass").innerHTML = "";
		// buttonOn = true;
		// buttonRegister.disabled = false;
	}
	else{
		document.getElementById("checkPass").innerHTML = "The passwords are not the same.";
		// buttonOn = false;
		// buttonRegister.disabled = true;
	}
}


function register () {
	// buttonRegister.disabled = true;
	
	let baliseNom = document.getElementById("form3Example1c");
	console.log(baliseNom);
	let uname = baliseNom.value;
	// console.log(uname); // affiche ce qui est contenu dans la balise name
	
	let balisePassword = document.getElementById("form3Example4c");
	let pass = balisePassword.value;
	// console.log(pass); // affiche ce qui est contenu dans la balise name

	let baliseEmail = document.getElementById("form3Example3c");
	let email = baliseEmail.value;
	// console.log(pass); // affiche ce qui est contenu dans la balise name
	
	var buttonRegister = document.getElementById("registerButton");
	buttonRegister.disabled = true;
	// document.getElementsById("registerButton").setAttribute("disabled", true);
	// if (buttonOn === true){
	// 	buttonRegister.disabled = false;
	// 	console.log("the button is able");
	// }
	// else{
	// 	buttonRegister.disabled = true;
	// 	console.log("the button is disable");
	// }

    fetch('http://127.0.0.1:8000/api/users/register/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: uname, email: email, password: pass})
  }).then(res => console.log("bravo"))
  	// .then(res => res.json())
    .then(res => console.log(res));
};

// recuperer les elements renvoyes par le formulaire et les envyer dans stringify
// si elements ok (code reponse bonne) envoyer "successfull ou un truc du genre"