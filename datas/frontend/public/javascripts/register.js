
var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

document.getElementById("form3Example3c").oninput = function (){checkEmail ()};
document.getElementById("form3Example4cd").oninput = function () {checkPasswords ()}; 

function checkEmail () {
	let inputEmail = document.getElementById("form3Example3c").value

	if (inputEmail.match(EMAIL_REGEX) )
		document.getElementById("checkMail").innerHTML = ""
	else
		document.getElementById("checkMail").innerHTML = "Wrong email address"
}

function checkPasswords () {
	let pass1 = document.getElementById("form3Example4c").value
	let pass2 = document.getElementById("form3Example4cd").value

	if (pass1 != pass2)
		document.getElementById("checkPass").innerHTML = "The passwords are not the same."
	else
		document.getElementById("checkPass").innerHTML = ""
}

function register () {
	let baliseNom = document.getElementById("form3Example1c")
	console.log(baliseNom)
	let uname = baliseNom.value
	console.log(uname); // affiche ce qui est contenu dans la balise name

	let balisePassword = document.getElementById("form3Example4c")
	let pass = balisePassword.value
	console.log(pass); // affiche ce qui est contenu dans la balise name


    fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({uname, pass})
  }).then(res => console.log("bravo"))
  	// .then(res => res.json())
    // .then(res => console.log(res));
};

// recuperer les elements renvoyes par le formulaire et les envyer dans stringify
// si elements ok (code reponse bonne) envoyer "successfull ou un truc du genre"