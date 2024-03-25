import AbstractView from "./AbstractView.js";


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


        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }
    async fillHtml(DOM) {
        console.log("fillHtml")
    }
    addEvents () {
        console.log("Add Events")
        document.querySelector('#loginButton').addEventListener("click", this.login);
        document.querySelector('#login42Button').addEventListener("click", this.login42);
    }


    login()
    {
        console.log("login() called")
        let baliseNom = document.getElementById("NameId");
        // console.log(baliseNom);
        let UserName = baliseNom.value;
        // console.log(uname); // affiche ce qui est contenu dans la balise name
        
        let balisePassword = document.getElementById("PasswordId");
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
        fetch('http://127.0.0.1:8000/api/auth/login/', {
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
                alert(data.message);
            }
        })
        // .catch(error => {
        // 	console.error('Erreur:', error);
        // })
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