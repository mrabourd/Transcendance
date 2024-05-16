import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"
import * as router from "../router.js";

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Login 2FA");

	}

	async getHtml(DOM) {
        await fetch('/template/login2FA').then(function (response) {
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

	async  addEvents () {
		console.log("enter login 2FA")
		document.getElementById("send_code").addEventListener('click', async (event) =>  {
			event.preventDefault();
            this.login2FA();
        })
	}
	
	login2FA = async () => {
		let username = document.getElementById("username").value;
		let email = document.getElementById("email").value;
		let password = document.getElementById("password").value;
		let data = {
			'username': username,
			'email': email,
			'password': password,
		};
		const resp_2FA = await this.user.request.post('/api/users/auth/login2FA/', data);
		if (resp_2FA.ok){
			const jsonData = await resp_2FA.json();
			console.log("data: ", jsonData);
			document.querySelector(".verify").innerHTML = "toto"
			if (jsonData.error)
			{
				console.log("error in login2FA")
			//     document.querySelector('#app').innerHTML =
			//         `<h1>${jsonData.error}</h1>
			//         <p>${jsonData.error_description}</p>`
			}
			else
			{
				console.log("ok")
				// this.user.setLocalDatas(jsonData.user)
				// this.user.request.setJWTtoken(jsonData.access, jsonData.refresh)
	
				// this.user.isConnected = true;
	
				// const resp_csrf = await this.user.request.post('/api/users/ma_vue_protegee/');
				// if(resp_csrf.status == 403)
				// {
				// 	console.warn("CSRF attack")
				// 	return true;
				// }
				// this.user.router.navigateTo('/profile/', this.user);
			}
			
			// return resp_2FA;
		} else if (resp_2FA.status === 401) {
			console.log("error 401")
			const jsonData = await resp_2FA.json();
			return jsonData.detail;
		}

	}

	// verifyPassword = async () => { 
    //     let username = document.querySelector("#loginForm #username").value;
    //     let password = document.querySelector("#loginForm #password").value;
    //     this.user.login(username, password)
    //     .then(async result => {
    //         if (result == true)
    //             router.navigateTo("/home", this.user)
    //         else
    //         {
    //             let errDiv = document.querySelector("#errorFeedback");
    //             errDiv.classList.remove("d-none")
    //             errDiv.innerHTML = 'An error occured ! Please check fields below ...';
    //             let jsonData = await result.json()
    //             for (const key in jsonData) {
    //                 if (Object.hasOwnProperty.call(jsonData, key))
    //                     utils.printError(key, 1, jsonData[key])
    //             }
    //         }
    //     })
    //     .catch(error => {
    //         console.error('login.js (76) : There was a problem with the fetch operation:', error);
    //     });
    // }
}