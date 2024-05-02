import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js"

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
			
			/*
			if (this.is_user_page())
				profile_url = '/template/profile_profile_edit'
			else
				profile_url = '/template/profile_profile'
			*/
			profile_url = '/template/profile_profile_edit'
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

			// Get Followed page HTML
			await fetch( '/template/profile_followed').then(function (response) {
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
		this.fillFollowed()
	}

	async fillFollowed()
	{
		//console.log("enter fill followed");
		//let followed = this.user.datas.followed[0].username;
		//console.log("followed: ", followed);
		//document.getElementById("friend_username").innerHTML = followed;
		/*
		uid = (this.params.user_id) ? this.params.user_id : this.user.datas.id
		let response = await this.user.request.get('/api/users/history/'+uid+'/')
		if (response.ok)
		{
			let jsonData = await response.json();
		}
		*/
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
		let UserDatas;


		if (this.is_user_page())
			UserDatas = this.user.datas
		else
		{
			var elements = document.querySelectorAll('input, textarea');
			elements.forEach(function(element) {
				element.setAttribute('readonly', 'readonly');
				element.classList.add('form-control-plaintext');
			});

			let response = await this.user.request.get('/api/users/profile/'+this.params.user_id+'/')
			if (response.ok)
				UserDatas = await response.json();
		}

		document.querySelector("#username").innerHTML = UserDatas.username;
		if(UserDatas.avatar)
			document.querySelector("#avatar").src = UserDatas.avatar;
		else
			document.querySelector("#avatar").src = "/avatars/default.png";
		document.querySelector(".tab-pane.profile #username").value = UserDatas.username;
		document.querySelector(".tab-pane.profile #first_name").value = UserDatas.first_name;
		document.querySelector(".tab-pane.profile #last_name").value = UserDatas.last_name;
		document.querySelector(".tab-pane.profile #email").value = UserDatas.email;
		document.querySelector(".tab-pane.profile #biography").value = UserDatas.biography;
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
			document.getElementById("submit_form").addEventListener('click', async (event) =>  {
				event.preventDefault();
				let RQ_Body = {
					avatar: document.querySelector("#avatar").src,
					username: document.querySelector("#username").innerHTML,
					first_name: document.querySelector("#first_name").value,
					last_name: document.querySelector("#last_name").value,
					email: document.querySelector("#email").value,
					biography: document.querySelector("#biography").value
				}
				this.user.request.put('/api/users/profile/'+this.user.datas.id+'/', RQ_Body)
				.then((response) =>
				{
					if (response.ok || response.status === 400)
                    	return Promise.all([response.json(), response.ok, response.status]);
                	else
                    	throw new Error('Network response was not ok.');
				})
				.then(([jsonData, ok, status]) => {
					if (!ok)
					{
						for (const key in jsonData) {
							if (Object.hasOwnProperty.call(jsonData, key))
							{
								console.warn(`${key} is invalid : ${jsonData[key]}`)
								//is-invalid
							}
						}
						//let errDiv = document.querySelector("#ProfileForm #errors");
						//errDiv.classList.remove("d-none")
						//errDiv.innerHTML = "An error occured ! Please check fields below ...";
					}
					else
					{

						// add is-valid
					}
				})
				.catch((error) => {
					// Gérer les erreurs de requête ou de conversion JSON
					console.error('There was a problem with the fetch operation:', error);
				});
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
