import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Profile");
	}
	
	is_user_page()
	{
		if (this.params.user_id)
		{
			if (this.params.user_id == this.user.datas.id)
				return true
			else
				return false
		}
		else
			return true
	}

	async getHtml(DOM) {
		await fetch('/template/profile').then(function (response) {
			// The API call was successful!
			return response.text();
		}).then(async html =>  {
			// This is the HTML from our response as a text string
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');
			let body = doc.querySelector('#app');
			DOM.innerHTML = body.innerHTML;

			// Get profile page HTML
			let profile_url;
			if (this.is_user_page())
				profile_url = '/template/profile_profile_edit'
			else
				profile_url = '/template/profile_profile'
			await fetch(profile_url).then(function (response) {
				return response.text();
			}).then(function (html) {
				let parser = new DOMParser();
				let doc = parser.parseFromString(html, 'text/html');
				document.querySelector('.tab-content').append(doc.querySelector('body div'));
			});

			// Get Hitory page HTML
			await fetch( '/template/profile_history').then(function (response) {
				return response.text();
			}).then(function (html) {
				let parser = new DOMParser();
				let doc = parser.parseFromString(html, 'text/html');
				document.querySelector('.tab-content').append(doc.querySelector('body div'));
			});

			// Get Stats page HTML
			await fetch( '/template/profile_stats').then(function (response) {
				return response.text();
			}).then(function (html) {
				let parser = new DOMParser();
				let doc = parser.parseFromString(html, 'text/html');
				document.querySelector('.tab-content').append(doc.querySelector('body div'));
			});
		}).catch(function (err) {
			// There was an error
			console.warn('Something went wrong.', err);
		});
	}

	async fillHtml(DOM) {
		if (!this.is_user_page())
			document.querySelector(".mt-2.image-upload").innerHTML = "";
		this.fillProfile()
		this.fillStats()
		this.fillHistory()
	}

	async fillHistory()
	{
		/*
		uid = (this.params.user_id) ? this.params.user_id : this.user.datas.id
		let response = await this.user.request.get('/api/users/history/'+uid+'/')
		if (response.ok)
		{
			let jsonData = await response.json();
		}
		*/
	}

	async fillStats()
	{
		/*
		uid = (this.params.user_id) ? this.params.user_id : this.user.datas.id
		let response = await this.user.request.get('/api/users/stats/'+uid+'/')
		if (response.ok)
		{
			let jsonData = await response.json();
		}
		*/
	}

	async fillProfile()
	{
		if (this.is_user_page())
		{
			document.querySelector("#username").innerHTML = this.user.datas.username;
			if(this.user.datas.avatar)
				document.querySelector("#avatar").src = this.user.datas.avatar;
			else
				document.querySelector("#avatar").src = "/avatars/default.png";
			document.querySelector(".tab-pane.profile #first_name").value = this.user.datas.first_name;
			document.querySelector(".tab-pane.profile #last_name").value = this.user.datas.last_name;
			document.querySelector(".tab-pane.profile #email").value = this.user.datas.email;
			document.querySelector(".tab-pane.profile #biography").value = this.user.datas.biography;
		}
		else
		{
			let response = await this.user.request.get('/api/users/profile/'+this.params.user_id+'/')
			if (response.ok)
			{
				let jsonData = await response.json();
				document.querySelector("#username").innerHTML = jsonData.username;
				if(jsonData.avatar)
					document.querySelector("#avatar").src = jsonData.avatar;
				else
					document.querySelector("#avatar").src = "/avatars/default.png";
				document.querySelector(".tab-pane.profile #first_name").innerText = jsonData.first_name;
				document.querySelector(".tab-pane.profile #last_name").innerText = jsonData.last_name;
				document.querySelector(".tab-pane.profile #email").innerText = jsonData.email;
				document.querySelector(".tab-pane.profile #biography").innerText = jsonData.biography;
			}
		}
	}


	async addEvents () {

		// TABS
		document.querySelectorAll('.nav.nav-tabs li').forEach(element => {
			element.addEventListener("click", e => {
				e.preventDefault();
				let link = element.getAttribute('data-target');
				document.querySelectorAll('.nav.nav-tabs li a').forEach(element => {
					element.classList.remove('active');
				});
				document.querySelector('.nav.nav-tabs li[data-target="' + link + '"] a').classList.add('active')

				document.querySelectorAll('.tab-content .tab-pane').forEach(element => {
					element.classList.remove('active');
				});
				document.querySelector('.tab-content .tab-pane.' + link).classList.add('active')
			});
		});


		// USER PROFILE FORM
		if (this.is_user_page())
		{
			document.getElementById("fileInput").addEventListener('change', async () =>  {
				
				document.getElementById("fileInput")
				document.querySelector("#status").innerText = "reading URL";
				this.readURL(document.getElementById("fileInput"));
			});
			document.getElementById("saveChanges").addEventListener('click', async (event) =>  {
				event.preventDefault();
				let RQ_Body = {
					avatar: document.querySelector("#avatar").src,
					username: document.querySelector("#username").innerHTML,
					first_name: document.querySelector("#first_name").value,
					last_name: document.querySelector("#last_name").value,
					email: document.querySelector("#email").value,
					biography: document.querySelector("#biography").value
				}
				let response = await this.user.request.put('/api/users/profile/'+this.user.datas.id+'/', RQ_Body)
			})
		}

	}

	// File Upload
	async readURL(input) {
		if (input.files && input.files[0]) {
			let reader = new FileReader();
			reader.onload = async function (e) {
				const file = input.files[0];
				const formData = new FormData();
				formData.append('avatar', file);
				fetch('/upload', {
					method: 'POST',
					enctype: 'multipart/form-data',
					body: formData
				})
			    .then(response => {
					return response.json()
				})
				.then(response => {
					if (response.ok) {
						document.getElementById("avatar").setAttribute('src', './avatars/' + response.message);

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
	
}
