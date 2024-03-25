import AbstractView from "./AbstractView.js";

var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Sign Up Transcendance");
    }

    async getHtml(DOM) {
        await fetch('/template/register').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;


        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }

    addEvents () {
        console.log("Add Events")
        document.querySelector('#registerButton').addEventListener("click", this.register);
        document.querySelector('#email').addEventListener("input", this.checkEmail);
        document.querySelector('#repeat-password').addEventListener("input", this.checkPasswords);
    }


    register()
    {
        console.log("register() called")

	// buttonRegister.disabled = true;
	
	let username = document.getElementById("username").value;	
	let realname = document.getElementById("realname").value;	
	let email = document.getElementById("email").value;	
	let password = document.getElementById("password").value;
	// console.log(pass); // affiche ce qui est contenu dans la balise name

	// console.log(pass); // affiche ce qui est contenu dans la balise name
	
	// var buttonRegister = document.getElementById("registerButton");
	// buttonRegister.disabled = true;
	// document.getElementsById("registerButton").setAttribute("disabled", true);

	
    fetch('http://127.0.0.1:8000/api/users/register/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
            "avatar": "/avatar/default.png",
            "username": username,
            "realname": realname,
            "email": email,
            "password": password
        })
	})
	// .then(res => console.log("bravo"))
	// // .then(res => res.json())
    // .then(res => console.log(res));
	
	.then((response) =>
	{
        console.log("RES", response, response.status)
		if (response.status === 201) {
            // TODO Receptionner JSON user et l'enregistrer dans le localStorage
        }
        else if (response.status === 400)
        {
            console.log("BAD REQUEST")
            document.getElementById("errors").classList.remove("d-none");
            document.querySelector('.error[for="username"]').classList.remove("d-none");
            document.querySelector('.error[for="username"]').innerHTML = "error huhu "
            document.getElementById("errors").innerHTML = "A user with this email address already exists.";
		}
		else
        {
            console.warn("BAD REQUEST")
            document.getElementById("errors").classList.remove("d-none");
            document.getElementById("errors").innerHTML = "An error occured ! check console logs.";
        }
			
	})
	//window.localStorage.setItem("username", uname);

	// userData = [{
	// 	username: document.getElementById('form3Example1c').value
	//   }, {
	// 	password: document.getElementById('form3Example4c').value
	//   }];
	//   usersr = JSON.parse(localStorage.getItem('Users')) || [];
	//   usersr.push(userData);
	//   localStorage.setItem('Users', JSON.stringify(usersr));
	//   location.reload()
	//   console.log(userData)
	  //continuer a checker: https://stackoverflow.com/questions/61162022/how-to-check-if-user-exist-in-local-storage
    }




        checkEmail(){
            let inputEmail = document.getElementById("email").value;
            
            if (inputEmail.match(EMAIL_REGEX) )
                document.getElementById("checkMail").innerHTML = "";
            else{
                document.getElementById("checkMail").innerHTML = "Wrong email address";
            }
        }

        checkPasswords() {
            let pass1 = document.getElementById("password").value;
            let pass2 = document.getElementById("repeat-password").value;
            
            if (pass1 === pass2){
                document.getElementById("checkPass").innerHTML = "";
                // buttonRegister.disabled = false;
            }
            else{
                document.getElementById("checkPass").innerHTML = "The passwords are not the same.";
                // buttonRegister.disabled = true;
            }
        }

}