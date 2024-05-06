import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"
import * as router from "../router.js";

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Login 42");

	}


	async  addEvents () {
		this.user.logout();
		// this.user.rmLocalDatas();
		// this.user.request.rmJWTtoken()
		// this.user.request.rmCsrfToken()

		// CODE DANS l'URL
		var queryString = window.location.search;
		queryString = queryString.substring(1);
		var params = queryString.split('/');
		var paramsObj = {};
		params.forEach(function(param) {
			var keyValue = param.split('=');
			var key = decodeURIComponent(keyValue[0]);
			var value = decodeURIComponent(keyValue[1] || '');
			paramsObj[key] = value;
		});
		var code42 = paramsObj['code'];
		console.log("code: ", code42);

		let data = {
			'code': code42,
		};
		let get_token_path = await this.user.request.post("/api/users/auth/intra_callback/", data);
		if (get_token_path.ok){
			console.log("coucou")
			const jsonData = await get_token_path.json();
			console.log("get_token_path ", jsonData.user);


			this.user.setLocalDatas(jsonData.user)
			this.user.request.setJWTtoken(jsonData.access, jsonData.refresh)

			this.user.isConnected = true;

			const resp_csrf = await this.user.request.post('/api/users/ma_vue_protegee/');
			if(resp_csrf.status == 403)
			{
				console.warn("CSRF attack")
				return true;
			}
			
			this.user.router.navigateTo('/profile/', this.user);
			// return get_token_path;
		} else if (response.status === 401) {
			const jsonData = await response.json();
			return jsonData.detail;
		}
		

	}
}