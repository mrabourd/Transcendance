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
		document.querySelector("#username").innerHTML = this.user.datas.username;
		document.querySelector("#first_name").value = this.user.datas.first_name;
		document.querySelector("#last_name").value = this.user.datas.last_name;
		document.querySelector("#email").value = this.user.datas.email;
		document.querySelector("#biography").value = this.user.datas.biography;

		if(this.user.datas.avatar)
			document.querySelector("#avatar").src = this.user.datas.avatar;
		else
			document.querySelector("#avatar").src = "./avatars/default.png";
	}

	
	addEvents () {
		console.log("fillHtml");

		document.getElementById("fileInput").addEventListener('change', function() {
			document.querySelector("#status").innerText = "reading URL";
			readURL(this);
		});
		
		function readURL(input) {
			console.log("inside readURL");
			if (input.files && input.files[0]) {
				console.log("inside if");
				let reader = new FileReader();

				reader.onload = function (e) {
					document.getElementById("avatar").setAttribute('src', e.target.result);

					console.log("uploadFile")
					//const fileInput = document.getElementById('chooseFile');
					const file = input.files[0];
					const formData = new FormData();
					formData.append('image', file);
				
					fetch('/upload', {
						method: 'POST',
						enctype: 'multipart/form-data',
						body: formData
					})
					.then(response => {
						if (response.ok) {
							document.getElementById('status').innerText = 'Image uploadée avec succès !';
						} else {
							document.getElementById('status').innerText = 'Erreur lors de l\'upload de l\'image.';
						}
					})
					.catch(error => {
						console.error('Erreur lors de l\'upload de l\'image :', error);
					});


				}
				reader.readAsDataURL(input.files[0]);
			}
		}

		document.getElementById("saveChanges").addEventListener('click', async () =>  {
			let RQ_Body = {
				avatar: document.querySelector("#avatar").src,
				username: document.querySelector("#username").innerHTML,
				first_name: document.querySelector("#first_name").value,
				last_name: document.querySelector("#last_name").value,
				email: document.querySelector("#email").value,
				biography: document.querySelector("#biography").value
			}
			let response = await this.user.request.put(`/api/users/profiles/${this.user.datas.id}/`, RQ_Body)
			
		})


	}
	
}
