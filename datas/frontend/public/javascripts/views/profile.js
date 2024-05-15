import AbstractView from "./AbstractView.js";
import * as form from "../utils_form.js"
import * as friends_utils from "../utils_friends.js"

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Profile");
		const UserDatas = null;
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

		if (this.is_user_page())
			this.UserDatas = this.user.datas
		else
		{
			var elements = document.querySelectorAll('input, textarea');
			elements.forEach(function(element) {
				element.setAttribute('readonly', 'readonly');
				element.classList.add('form-control-plaintext');
			});

			let response = await this.user.request.get('/api/users/profile/'+this.params.user_id+'/')
			if (response.ok)
			this.UserDatas = await response.json();
		}
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
		let profile_card_url = '/template/profile_card'
		await fetch(profile_card_url).then(function (response) {
			return response.text();
		}).then( async (html) => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');
			let DOMProfileCard = doc.querySelector('.profile_card');
			let dest_container = document.querySelector('main .followed ul')
	
			let nodeCopy;
			if (dest_container.hasChildNodes())
				return ;
			const friends = this.UserDatas.follows;
			if (!friends)
				return
			friends.forEach(async friend_id => {

				let response = await this.user.request.get(`/api/users/profile/${friend_id}/`)
				if (response.status === 200)
				{
					let friend = await response.json();
					if (friend.username === "root" || friend.id === this.UserDatas.id)
						return;
					let test = dest_container.querySelector(`.profile_card[data-friend-id="${friend.id}"]`);
					if (test)
						return;
					nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, this.user, friend)
					dest_container.appendChild(nodeCopy);
					friends_utils.update_friends_thumbnails(this.user, friend)
				}
			})
		});


		/*
		Promise.all(
			(this.user.datas.follows).map(async (followed) => {
				// console.log("followed: ", followed);	
				let url = '/api/users/profile/'+followed+'/';
				let response = await this.user.request.get(url);
				const userListContainer = document.getElementById("userList");
				const userDiv = document.createElement("div");

				if (response.ok) {
					const users_followed = await response.json();
					if (users_followed.id == undefined || users_followed.username == "root")
						return;

					userDiv.innerHTML = userListContainer.innerHTML; // Copie le HTML depuis le fichier HTML
					userDiv.querySelector("#friend_avatar").src = users_followed.avatar;
					userDiv.querySelector("#friend_username").textContent = users_followed.username;
					userDiv.querySelector("#friend_status").textContent = users_followed.status;
			  
				}
				
				else
					console.log("Not ok");
				userListContainer.appendChild(userDiv);
			
		}),
		)
		.catch((error) => {
			console.error("Une erreur s'est produite lors du traitement des requêtes :", error);
		});
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
		document.querySelector(".user_username").innerHTML = this.UserDatas.username;
		document.querySelector("#avatar").src = ( this.UserDatas.avatar) ?  this.UserDatas.avatar : "/avatars/default.png";
		document.querySelector(".tab-pane.profile #username").value =  this.UserDatas.username;
		document.querySelector(".tab-pane.profile #first_name").value =  this.UserDatas.first_name;
		document.querySelector(".tab-pane.profile #last_name").value =  this.UserDatas.last_name;
		document.querySelector(".tab-pane.profile #email").value =  this.UserDatas.email;
		document.querySelector(".tab-pane.profile #biography").value =  this.UserDatas.biography;
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



			document.querySelectorAll('.tab-pane.profile form input[type="text"]').forEach(input => {
				input.addEventListener("focusout", form.checkBlankField);
			});
			document.querySelector('.tab-pane.profile form #email').addEventListener("focusout", form.checkEmail);

			document.getElementById("submit_form").addEventListener('click', async (event) =>  {
				event.preventDefault();
				
				if (!this.checkAllFields())
					return false;
	
				
				let RQ_Body = {
					avatar: document.querySelector("#avatar").src,
					username: document.querySelector("#username").value,
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
								document.querySelector(`.tab-pane.profile #${key}`).classList.add(`is-invalid`)
								document.querySelector(`.tab-pane.profile #${key}Feedback`).innerHTML = jsonData[key]
							}
						}
						let errDiv = document.querySelector("#ProfileForm #errorFeedback");
						errDiv.classList.remove("d-none", "alert-success")
						errDiv.classList.add("alert-danger")
						errDiv.innerHTML = "An error occured ! Please check fields below ...";
					}
					else
					{
						this.user.setLocalDatas(jsonData)
						document.querySelectorAll('.tab-pane.profile form input[type="text"]').forEach(input => {
							input.classList.remove(`is-invalid`)
							input.classList.remove(`is-valid`)
						});
						let errDiv = document.querySelector("#ProfileForm #errorFeedback");
						errDiv.classList.remove("d-none", "alert-danger")
						errDiv.classList.add("alert-success")
						errDiv.innerHTML = "Well done ! ...";

					}
				})
				.catch((error) => {
					// Gérer les erreurs de requête ou de conversion JSON
					console.error('There was a problem with the fetch operation:', error);
				});
			})
		}

	}

    checkAllFields = () =>
    {
        // Récupérer tous les champs du formulaire
        let fields = document.querySelectorAll(".tab-pane.profile form input[type='text']");

        // Vérifier chaque champ * de type text / ne dois pas etre vide.
        let isValid = true;
        fields.forEach(field => {
            if (!form.checkBlankField({ target: field })) {
                isValid = false;
            }
        });

        let check_email = form.checkEmail({ target: document.querySelector('.tab-pane.profile form input#email') });
       
        if (isValid  && check_email)
            return true;
        return false
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
