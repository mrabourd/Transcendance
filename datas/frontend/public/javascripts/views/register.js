import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"
import * as router from "../router.js";


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
                ['first_name', { libelle: "Firstname *", type: "text" }],
                ['last_name', { libelle: "Lastname *", type: "text" }],
                ['email', { libelle: "Email *", type: "email" }],
                ['password', { libelle: "Password *", type: "password" }],
                ['repeat-password', { libelle: "repeat your password *", type: "password" }],
            ]).forEach((value, key, map) => {
                let main_div    = utils.FormcreateElement("div",  ["d-flex", "flex-row", "align-items-center", "mb-4"]);
                let inner_div   = utils.FormcreateElement("div",  ["form-outline", "flex-fill", "mb-0"]);
                let label       = utils.FormcreateElement("label", ["form-label"], { "for": `${key}`, "innerText": value.libelle });
                let input       = utils.FormcreateElement("input", ["form-control"], { "type": value.type, "id": `${key}` });
                let error       = utils.FormcreateElement("div",  ["error", "alert", "alert-danger", "d-none"], { "for": `${key}` });
                utils.FormAppendElements(inner_div, label, input, error);
                utils.FormAppendElements(main_div, inner_div);
                RegisterForm.appendChild(main_div);
            });
            let submitBt    = utils.FormcreateElement("button",  ["btn", "btn-primary", "btn-lg"],
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
        document.querySelector('#registerForm #email').addEventListener("focusout", utils.checkEmail);
        document.querySelector('#registerForm #password').addEventListener("focusout", this.checkPassword);
        document.querySelector('#registerForm #repeat-password').addEventListener("focusout", this.checkRepeatPassword);

        document.querySelectorAll('#registerForm input[type="text"]').forEach(input => {
            input.addEventListener("focusout", utils.checkBlankField);
        });
    }

    register = () => {
        if (!this.checkAllFields())
            return false;

        fetch('https://127.0.0.1:8443/api/users/register/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://127.0.0.1:8483',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "avatar": "/avatar/default.png",
                "username": document.getElementById("username").value,
                "first_name": document.getElementById("first_name").value,
                "last_name": document.getElementById("last_name").value,
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value
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
                    if (Object.hasOwnProperty.call(jsonData, key))
                        utils.printError(key, 1, jsonData[key])
                }
                return "An error occured ! Please check fields below ..."
            }
            else
            {
                let username = document.getElementById("username").value
                let password = document.getElementById("password").value
                let response = this.user.login(username, password);
                return response;
            }
        })
        .then(result => {
            if (result === true)
                router.navigateTo("/home", this.user)
            else
            {
                let errDiv = document.querySelector("#registerForm #errors");
                errDiv.classList.remove("d-none")
                errDiv.innerHTML = result;
            }

        })
        .catch((error) => {
            // Gérer les erreurs de requête ou de conversion JSON
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    checkPassword = () => {
            let pass1 = document.querySelector('#registerForm input#password').value

            if (!this.isPasswordStrong(pass1))
            {
                utils.printError("password", true, "The password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.")
                return false;
            }
            else 
            {
                utils.printError("password", false, "")
                return true
            }

        }
    checkRepeatPassword = () =>
    {
        let pass1 = document.querySelector('#registerForm input#password').value
        let pass2 = document.querySelector('#registerForm input#repeat-password').value

        if (pass1 === pass2){
            utils.printError("repeat-password", false, "");
            return true;
        }
        else
        {
            utils.printError("repeat-password", true, "The passwords are not the same.");
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

    checkAllFields = () =>
    {
        // Récupérer tous les champs du formulaire
        let fields = document.querySelectorAll("#registerForm input[type='text']");

        // Vérifier chaque champ * de type text / ne dois pas etre vide.
        let isValid = true;
        fields.forEach(field => {
            if (!utils.checkBlankField({ target: field })) {
                isValid = false;
            }
        });

        let check_pass = this.checkPassword;
        let check_pass2 = this.checkRepeatPassword;
        let check_email = utils.checkEmail({ target: document.querySelector('#registerForm input#email') });
       
        if (isValid && check_pass && check_pass2 && check_email)
            return true;
        return false
    }

}