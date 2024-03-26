import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"
import * as router from "../router.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login too Transcendance");
    }

    async getHtml(DOM) {
        await fetch('/template/login').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;

            /* ADD FORM FIELDS */
            let RegisterForm = document.querySelector("#loginForm");
            new Map([
                ['username', { libelle: "Username *", type: "text" }],
                ['password', { libelle: "Password *", type: "password" }],
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
                {   "innerText": "Sign In!",
                    "id": `loginButton`,
                    "type": "button"
                });
            RegisterForm.appendChild(submitBt);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }

    addEvents () {
        document.querySelectorAll('#loginForm input').forEach(input => {
            input.addEventListener("focusout", utils.checkBlankField);
        });
        document.querySelector('#loginButton').addEventListener("click", this.login);
        document.querySelector('#login42Button').addEventListener("click", this.login42);
    }


    login = () => {
        if (!this.checkAllFields())
            return false;        
        let username = document.querySelector("#loginForm #username").value;
        let password = document.querySelector("#loginForm #password").value;

        this.user.login(username, password)
        .then(result => {
            if (result === true)
                router.navigateTo("/profile", this.user)
            else
            {
                let errDiv = document.querySelector("#loginForm #errors");
                errDiv.classList.remove("d-none")
                errDiv.innerHTML = result;
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    checkAllFields = () =>
    {
        // Récupérer tous les champs du formulaire
        let fields = document.querySelectorAll("#loginForm input[type='text']");

        // Vérifier chaque champ
        let isValid = true;
        fields.forEach(field => {
            if (!utils.checkBlankField({ target: field })) {
                isValid = false;
            }
        });
        return isValid;
    }
    login42()
    {
        console.log("login42() called")
        const authorizeUrl = 'https://api.intra.42.fr/oauth/authorize';
    
        // Paramètres requis pour l'autorisation (client_id, redirect_uri, etc. a ajouter : scope, state, etc.)
        const clientId = 'client_id'; // Remplacez cela par votre propre client_id
        const redirectUri = 'https://localhost:3000/callback'; // Remplacez cela par votre propre URI de redirection
        // Construire l'URL d'autorisation avec les paramètres requis
        const formattedUrl = `${authorizeUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
        // Rediriger l'utilisateur vers l'URL d'autorisation
        window.location.href = formattedUrl;
    }

}