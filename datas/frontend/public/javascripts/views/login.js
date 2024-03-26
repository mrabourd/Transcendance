import AbstractView from "./AbstractView.js";

/* UTILS */
import * as utils from "../utils_form.js"

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
        document.querySelector('#loginButton').addEventListener("click", this.login);
        document.querySelector('#login42Button').addEventListener("click", this.login42);
    }


    login()
    {
        console.log("login() called")
        let baliseNom = document.getElementById("username");
        // console.log(baliseNom);
        let UserName = baliseNom.value;
        // console.log(uname); // affiche ce qui est contenu dans la balise name
        
        let balisePassword = document.getElementById("password");
        let UserPassword = balisePassword.value;
          
        // const nameUser = JSON.parse(localStorage.getItem("username")) || [];
        // loginData = [{
        // 	loginName: UserName}, {
        // 	loginPass: UserPassword
        // 	}];
        // nameUser.push(loginData)
        // localStorage.setItem("username", JSON.stringify(nameUser))
        // console.log(nameUser)
        // location.reload()
        fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: UserName, password: UserPassword})
      })
        .then(res => res.json())
        // .then(res => console.log(res));
        // .then((res) =>
        // {
        // 	if (!res.ok) {
        // 		document.getElementById("finishLogin").innerHTML = "This user doesn't exist!";
        // 	}
        // 	else
        // 		console.log("bravo, you are logged in")
        // })
        .then(data => {
            if (data.success) {
                localStorage.setItem("username", UserName);
                localStorage.setItem("password", UserPassword);
                console.log("bravo, you are logged in")
            } else {
                console.log(data.detail);
            }
        })
        // .catch(error => {
        // 	console.error('Erreur:', error);
        // })
    }
/*
const tokenData = {
    refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxMjM0OTg3MywiaWF0IjoxNzExMDUzODczLCJqdGkiOiIyYmQyYzVhOTBkNjc0ODg5OTIwYzZmNDFjZmJhYTBjZiIsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZ2xhIiwiZW1haWwiOiJnbGFAZ2xvdS5jb20ifQ.vYlYzmyvC9Gk-XgcAO3623Qa2YXldVvAKxaG4jYAZ1Y",
    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzExMDU0MTczLCJpYXQiOjE3MTEwNTM4NzMsImp0aSI6IjhlMThiMzk3MTgxMDQ1YTA4Y2RkNzYzODI5NTk3YjA1IiwidXNlcl9pZCI6MiwidXNlcm5hbWUiOiJnbGEiLCJlbWFpbCI6ImdsYUBnbG91LmNvbSJ9.UKOY4Xb1xrW2W5bqhcB1Fz6benfMjqXQYNuxgROtIBg"
};
// Convertir les données en format JSON
const tokenDataJSON = JSON.stringify(tokenData);

// Stocker les données dans le stockage local
localStorage.setItem('tokens', tokenDataJSON);

// Pour récupérer les données ultérieurement :
const storedTokenDataJSON = localStorage.getItem('tokens');
const storedTokenData = JSON.parse(storedTokenDataJSON);

// Maintenant vous pouvez utiliser storedTokenData.refresh et storedTokenData.access comme nécessaire dans vos appels d'API.
*/

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