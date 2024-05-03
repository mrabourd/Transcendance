import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"
import * as router from "../router.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login 42");

    }


   async  addEvents () {
        console.log("enter 42 login")
        // this.user.rmLocalDatas();
        // this.user.request.rmJWTtoken()
        // this.user.request.rmCsrfToken()

        // CODE DANS l'URL
        // var queryString = window.location.search;
        // queryString = queryString.substring(1);
        // var params = queryString.split('/');
        // var paramsObj = {};
        // params.forEach(function(param) {
        //     var keyValue = param.split('=');
        //     var key = decodeURIComponent(keyValue[0]);
        //     var value = decodeURIComponent(keyValue[1] || '');
        //     paramsObj[key] = value;
        // });
        // var code = paramsObj['code'];
        // console.log("code: ", code);

        // FETCH 42 pour recuperer un token

        // let get_token_path = "https://api.intra.42.fr/oauth/token"
        // let data = {
        //     'grant_type': 'authorization_code',
        //     'client_id': 'u-s4t2ud-32b19fff9e0bdc8b9a6274453ce546cef0f304df7e01d5b7d3be2cac715fa306',
        //     'client_secret': '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',
        //     'code': code,
        //     'redirect_uri': 'https://localhost:8443/api/users/auth/intra_callback',
        // }
        // let r =  await fetch(get_token_path, {
        //     method: "POST",
        // });


        // let headers = {"Authorization": "Bearer %s" % token}

        await fetch('/backend-endpoint')
            .then(response => {

                // var queryString = window.location.search;
                // console.log("url: ", queryString)
                // queryString = queryString.substring(1);
                // var params = queryString.split('/');
                // var paramsObj = {};
                // params.forEach(function(param) {
                //     var keyValue = param.split('=');
                //     var key = decodeURIComponent(keyValue[0]);
                //     var value = decodeURIComponent(keyValue[1] || '');
                //     paramsObj[key] = value;
                // });
                // var code = paramsObj['code'];
                // console.log("code: ", code);


                if (response.ok) {
                    console.log("response: ", response)
                // Rediriger automatiquement vers la page frontend après une réponse réussie du backend
                    // window.location.href = 'https://localhost:8483/login42/';
                } else {
                    console.error('Erreur lors de la requête au backend');
                }
            })
            .catch(error => console.error('Erreur:', error));


        // TECH BACK DJANO a
        // this.user.request.post(`/api/users/auth/intra_callback/?code=${code}`)

    }
}