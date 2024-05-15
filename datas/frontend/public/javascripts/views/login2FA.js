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
        let phoneNumber = document.querySelector("#loginForm #phonenumber").value;
		let data = {
			'phone_number': phoneNumber,
		};
		const resp_2FA = await this.user.request.post('/api/users/auth/login2FA', data);
        if (resp_2FA.ok){
			const jsonData = await resp_2FA.json();

			if (jsonData.error)
            {
                console.log("error in login2FA")
            //     document.querySelector('#app').innerHTML =
            //         `<h1>${jsonData.error}</h1>
            //         <p>${jsonData.error_description}</p>`
            // }
            // else
            // {
			// 	this.user.setLocalDatas(jsonData.user)
			// 	this.user.request.setJWTtoken(jsonData.access, jsonData.refresh)

			// 	this.user.isConnected = true;

			// 	const resp_csrf = await this.user.request.post('/api/users/ma_vue_protegee/');
			// 	// if(resp_csrf.status == 403)
			// 	// {
			// 	// 	console.warn("CSRF attack")
			// 	// 	return true;
			// 	// }
			// 	this.user.router.navigateTo('/profile/', this.user);
			}
			
			// return resp_2FA;
		} else if (response.status === 401) {
			const jsonData = await response.json();
			return jsonData.detail;
		}
	}
}