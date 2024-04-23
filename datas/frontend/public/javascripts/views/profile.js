import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Profile");
	}
	
	
	async getHtml(DOM) {
		await fetch('/template/profile').then(function (response) {
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
		console.log("salut")
		console.log("fillHtml")
		// document.querySelector("#id span").innerText = this.user.datas.id;
		document.querySelector("#username").innerText = this.user.datas.username;
		// document.querySelector("#biography").placeholder = this.user.datas.biography;
		// document.querySelector("#avatar").src = this.user.datas.user.avatar;
		// console.log(document.querySelectors("#first_name"))
		// console.log("data " + this.user.datas.first_name)
		document.querySelector("#first_name").value = this.user.datas.first_name;
		document.querySelector("#last_name").value = this.user.datas.last_name;
		document.querySelector("#email").value = this.user.datas.email;
		// document.querySelector("#password span").innerText = this.user.datas.password;
		// document.querySelector("#refresh span").innerText = this.user.datas.refresh;
		// document.querySelector("#access span").innerText = this.user.datas.access;
		// document.querySelector("#isConnected span").innerText = this.user.datas.isConnected;
		
	}

	
	addEvents () {
		console.log("fillHtml");

		// document.getElementById("chooseFile").addEventListener('change', function() {
		// 	document.querySelector("#status").innerText = "reading URL";
		// 	console.log('this:', this);
		// 	readURL(this);
		// });
		// let avatar;
		// function readURL(input) {
		// 	console.log("inside readURL");
		// 	if (input.files && input.files[0]) {
		// 		console.log("inside if");
		// 		let reader = new FileReader();

		// 		reader.onload = function (e) {
		// 			document.getElementById("avatar").setAttribute('src', e.target.result);
		// 			console.log("photo uploaded");
		// 			document.querySelector("#status").innerText = "File uploaded!";
		// 			avatar = document.getElementById("avatar").src;
		// 			console.log("img:", avatar);
		// 		}
		// 		reader.readAsDataURL(input.files[0]);
		// 	}
		// 	console.log("outside if");
		// }

		let RQ_Body =  {
			// "avatar": "/avatar/default.png",
			"username": document.querySelector("#username").value,
			"first_name": document.getElementById("first_name").value,
			"last_name": document.getElementById("last_name").value,
			"email": document.getElementById("email").value,
			"biography": document.querySelector("#biography").value
			// "password": document.getElementById("password").value
		}

		document.getElementById("saveChanges").addEventListener('click', this.updateProfile(RQ_Body));

			// console.log("enter save changes");
			// let token = window.localStorage.getItem("LocalToken");
			// let data = JSON.parse(token);
			// console.log(data);
			// data.user.avatar = avatar;
			// window.localStorage.setItem("LocalToken", JSON.stringify(data));
			// console.log("new data:", data);console.log("user login()")

	}

	async updateProfile(RQ_Body) {
		console.log("coucou!!")
		let response = await this.user.request.put('/api/users/profile/'+this.user.datas.id+'/', RQ_Body)
		console.log("this: ", this)
		if (response.ok)
		{          
			const jsonData = await response.json();

			console.log("jsonData:", jsonData);


			// this.setLocalDatas(jsonData.user)
			// this.request.setLocalToken(jsonData.access, jsonData.refresh)

			// this.isConnected = true;
			// this.view.printHeader();
			return true;
		} else if (response.status === 401) {
			const jsonData = await response.json();
			return jsonData.detail;
		}
	}
	
}
