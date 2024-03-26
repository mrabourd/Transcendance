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
           let RegisterForm = document.querySelector("#registerForm");
            new Map([
                ['username', { libelle: "Username *", type: "text" }],
                ['firstname', { libelle: "Firstname *", type: "text" }],
                ['lastname', { libelle: "Lastname *", type: "text" }],
                ['email', { libelle: "Email *", type: "email" }],
                ['password', { libelle: "Password *", type: "password" }],
                ['repeat-password', { libelle: "repeat your password *", type: "password" }],
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
        document.querySelector('#registerForm  #registerButton').addEventListener("click", this.register);
        document.querySelector('#registerForm #email').addEventListener("focusout", this.checkEmail);
        document.querySelector('#registerForm #password').addEventListener("focusout", this.checkPassword);
        document.querySelector('#registerForm #repeat-password').addEventListener("focusout", this.checkRepeatPassword);

        document.querySelectorAll('#registerForm input[type="text"]').forEach(input => {
            input.addEventListener("focusout", this.checkBlankField);
        });
    }



    register = () => {
        if (!this.checkAllFields())
            return false;
	
        let username = document.getElementById("username").value;	
        let firstname = document.getElementById("firstname").value;	
        let lastname = document.getElementById("lastname").value;	
        let email = document.getElementById("email").value;	
        let password = document.getElementById("password").value;

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
        .then((response) =>
        {
            if (response.ok || response.status === 400)
                return Promise.all([response.json(), response.ok, response.status]);
            else
                throw new Error('Network response was not ok.');
        })
        .then(([jsonData, ok, status]) => {
            if (!ok)
            {
                for (const key in jsonData) {
                    if (Object.hasOwnProperty.call(jsonData, key)) {
                        const value = jsonData[key];
                        this.printError(key, 1, value)
                    }
                }
            }
            else
            {
                console.log("Bravo !");
            }
            console.log("JSON Data:", jsonData);
            console.log("Response status:", status)
        })
        .catch((error) => {
            // Gérer les erreurs de requête ou de conversion JSON
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    checkEmail = () => {
        let inputEmail = document.querySelector('#registerForm input#email').value
        if (inputEmail.match(EMAIL_REGEX) )
        {
            this.printError("email", false, "")
            return true;
        }
        else
        {
            this.printError("email", true, "Wrong email address")
            return false;
        }
    }
    checkPassword = () => {
            let pass1 = document.querySelector('#registerForm input#password').value

            if (!this.isPasswordStrong(pass1))
            {
                this.printError("password", true, "The password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.")
                return false;
            }
            else 
            {
                this.printError("password", false, "")
                return true
            }

        }
    checkRepeatPassword = () =>
    {
        let pass1 = document.querySelector('#registerForm input#password').value
        let pass2 = document.querySelector('#registerForm input#repeat-password').value

        if (pass1 === pass2){
            this.printError("repeat-password", false, "");
            return true;
        }
        else
        {
            this.printError("repeat-password", true, "The passwords are not the same.");
            return false;
        }
    }
    isPasswordStrong = (password) =>
    {
            if (password.length < 8)
                return false;
            if (!/[A-Z]/.test(password))
                return false;
            if (!/[a-z]/.test(password))
                return false;        
            if (!/\d/.test(password))
                return false;
            if (!/[^A-Za-z0-9]/.test(password))
                return false;
        return true;
    }
    checkBlankField(event)
    {
        let value = event.target.value;
        let field = event.target.getAttribute("id");
        console.log("checkBlankField", field, value) 
        if (value === "")
        {
            document.querySelector(`#registerForm .error[for="` + field + `"]`).classList.remove("d-none");
            document.querySelector(`#registerForm .error[for="` + field + `"]`).innerHTML = "this fields must not be blank";
            return false;
        }
        else
        {
            document.querySelector(`#registerForm .error[for="` + field + `"]`).classList.add("d-none");
            return true;
        }
    }
    checkAllFields = () =>
    {
        return true;
        // Récupérer tous les champs du formulaire
        let fields = document.querySelectorAll("#registerForm input[type='text']");

        // Vérifier chaque champ
        let isValid = true;
        fields.forEach(field => {
            if (!this.checkBlankField({ target: field })) {
                isValid = false;
            }
        });
        let check_pass = this.checkPassword;
        let check_pass2 = this.checkRepeatPassword;
        let check_email = this.checkEmail;
        if (isValid && check_pass && check_pass2 && check_email)
            return true;
        return false
    }
    printError = (field, isError, innerText) =>
    {
        if (isError)
            document.querySelector(`#registerForm .error[for="` + field + `"]`).classList.remove("d-none");
        else
            document.querySelector(`#registerForm .error[for="` + field + `"]`).classList.add("d-none");
        document.querySelector(`#registerForm .error[for="` + field + `"]`).innerHTML = innerText;
    }
}