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
		// document.querySelector("#avatar span").innerText = this.user.datas.avatar;
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

		document.getElementById("chooseFile").addEventListener('change', function() {
			document.querySelector("#status").innerText = "reading URL";
			console.log('this:', this);
			readURL(this);
		});
		function readURL(input) {
			console.log("inside readURL");
			if (input.files && input.files[0]) {
				console.log("inside if");
				let reader = new FileReader();

				reader.onload = function (e) {
					document.getElementById("photo").setAttribute('src', e.target.result);
					console.log("photo uploaded");
					document.querySelector("#status").innerText = "File uploaded!";
				}
				reader.readAsDataURL(input.files[0]);
			}
			console.log("outside if");
		}

		document.getElementById("saveChanges").addEventListener('click', function() {
			let avatar = document.getElementById("photo");
			console.log("img:", avatar);
			avatar.src = localStorage.getItem("photo");
		});

	}
	
}
