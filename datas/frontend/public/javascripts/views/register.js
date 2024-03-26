import AbstractView from "./AbstractView.js";

var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function FormcreateElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'innerText')
            element.innerText = value
        else
            element.setAttribute(key, value);
    }
    return element;
}
function FormAppendElements(parent, ...children) {
    children.forEach(child => parent.appendChild(child));
}
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
            /* ADD FORM FIELDS */
           let RegisterForm = document.querySelector("form");
            new Map([
                ['username', { libelle: "Username", type: "text" }],
                ['firstname', { libelle: "Firstname", type: "text" }],
                ['lastname', { libelle: "Lastname", type: "text" }],
                ['email', { libelle: "Email", type: "email" }],
                ['password', { libelle: "Password", type: "password" }],
                ['repeat-password', { libelle: "repeat your password", type: "password" }],
            ]).forEach((value, key, map) => {
                let main_div    = FormcreateElement("div",  ["d-flex", "flex-row", "align-items-center", "mb-4"]);
                let inner_div   = FormcreateElement("div",  ["form-outline", "flex-fill", "mb-0"]);
                let label       = FormcreateElement("label", ["form-label"], { "for": `${key}`, "innerText": value.libelle });
                let input       = FormcreateElement("input", ["form-control"], { "type": value.type, "id": `${key}` });
                let error       = FormcreateElement("div",  ["error", "alert", "alert-danger", "d-none"], { "for": `${key}` });
                FormAppendElements(inner_div, label, input, error);
                FormAppendElements(main_div, inner_div);
                RegisterForm.appendChild(main_div);
            });
            let submitBt    = FormcreateElement("button",  ["btn", "btn-primary", "btn-lg"],
                {   "innerText": "Register!",
                    "id": `registerButton`,
                    "type": "button"
                });
            RegisterForm.appendChild(submitBt);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }

    addEvents () {
        document.querySelector('#registerButton').addEventListener("click", this.register);
        document.querySelector('#email').addEventListener("input", this.checkEmail);
        document.querySelector('#repeat-password').addEventListener("input", this.checkPasswords);
    }



    register = () => {
        console.log("register() called")

	// buttonRegister.disabled = true;
	
	let username = document.getElementById("username").value;	
	let firstname = document.getElementById("firstname").value;	
	let lastname = document.getElementById("lastname").value;	
	let email = document.getElementById("email").value;	
	let password = document.getElementById("password").value;
	// console.log(pass); // affiche ce qui est contenu dans la balise name

	// console.log(pass); // affiche ce qui est contenu dans la balise name
	
	// var buttonRegister = document.getElementById("registerButton");
	// buttonRegister.disabled = true;
	// document.getElementsById("registerButton").setAttribute("disabled", true);
    if (!this.checkEmail() || !this.checkPasswords())
    {
        return false;
    }
    fetch('http://127.0.0.1:8000/api/users/register/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
            "avatar": "/avatar/default.png",
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
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




    checkEmail = () => {
            console.log("checkEmail")
            let inputEmail = document.querySelector('input#email').value
            if (inputEmail.match(EMAIL_REGEX) )
            {
                document.querySelector('.error[for="email"]').classList.add("d-none");
                document.querySelector('.error[for="email"]').innerHTML = "";
                return true;
            }
            else
            {
                document.querySelector('.error[for="email"]').classList.remove("d-none");
                document.querySelector('.error[for="email"]').innerHTML = "Wrong email address";
                return false;
            }
        }
        checkPasswords = () => {
            let pass1 = document.querySelector('input#password').value
            let pass2 = document.querySelector('input#repeat-password').value
            if ((pass1 === pass2) && (pass1 !== "")){
                document.querySelector('.error[for="repeat-password"]').classList.add("d-none");
                document.querySelector('.error[for="repeat-password"]').innerHTML = "";
                return true;
            }
            else
            {
                document.querySelector('.error[for="repeat-password"]').classList.remove("d-none");
                document.querySelector('.error[for="repeat-password"]').innerHTML = "The passwords are not the same.";
                return false;
            }
        }

}