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
			if (!this.is_user_page())
			{
				await fetch( '/template/profile_followed').then(function (response) {
					return response.text();
				}).then(function (html) {
					let parser = new DOMParser();
					let doc = parser.parseFromString(html, 'text/html');
					document.querySelector('.tab-content').append(doc.querySelector('body div'));
				});
			}
			else
			{
				let del = document.querySelector('.nav-item[data-target="followed"]');
				del.remove()
			}
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
			let dest_container = document.querySelector('main .followed ul')
	
			if (dest_container.hasChildNodes())
				return ;
			if(!this.UserDatas)
				return;
			const friends = this.UserDatas.follows;
			if (!friends)
				return
			friends.forEach(async friend_id => {
				const nodeCopy = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, friend_id);
				dest_container.appendChild(nodeCopy);
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

	formatDate = (isoDate) => {
		// Créer un objet Date à partir de la chaîne de date ISO
		const date = new Date(isoDate);
	
		// Extraire les différentes parties de la date
		const day = String(date.getUTCDate()).padStart(2, '0'); // Jour (DD)
		const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mois (MM)
		const year = String(date.getUTCFullYear()).slice(2); // Année (YY)
		const hours = String(date.getUTCHours()).padStart(2, '0'); // Heure (HH)
		const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Minute (MM)
	
		// Formater la date selon le format souhaité
		let newDate = `${day}-${month}-${year} ${hours}:${minutes}`;
		return newDate;
	}

	async fillHistory()
	{
		let URL = '/api/match/history/'+ this.UserDatas.id+'/';

		let response_matches_stats = await this.user.request.get(URL);

        if (response_matches_stats.ok)
        {
			let match_stat = await response_matches_stats.json();
			let matchs = match_stat.matchs;
			
			let tbody = document.querySelector(".table");
			
			matchs.forEach(async match => {
				
				let newMatch = document.createElement('tr');
				newMatch.classList.add('new-match');

				let matchDate = document.createElement('td');
				matchDate.classList.add('match-date');

				let player1 = document.createElement('td');
				player1.classList.add('player1');
				
				let scorePlayer1 = document.createElement('td');
				scorePlayer1.classList.add('scorePlayer1');
				
				let player2 = document.createElement('td');
				player2.classList.add('player2');
				
				let scorePlayer2 = document.createElement('td');
				scorePlayer2.classList.add('scorePlayer2');

				let winner = document.createElement('td');
				winner.classList.add('winner');

				let p1 = match.match_points[0].points;
				let p2 = match.match_points[1].points;

				matchDate.innerHTML = this.formatDate(match.created_at);
				player1.innerHTML = match.match_points[0].alias;
				player2.innerHTML = match.match_points[1].alias;
				scorePlayer1.innerHTML = match.match_points[0].points;
				scorePlayer2.innerHTML = match.match_points[1].points;
				if (p1 > p2){
					if (match.match_points[0].alias == this.UserDatas.username){
						winner.classList.add('text-success');
					}
					else {
						winner.classList.add('text-danger');
					}
					winner.innerHTML = match.match_points[0].alias;
				}
				else{
					if (match.match_points[1].alias == this.UserDatas.username){
						winner.classList.add('text-success');
					}
					else {
						winner.classList.add('text-danger');
					}
					winner.innerHTML = match.match_points[1].alias;
				}

				newMatch.appendChild(matchDate);
				newMatch.appendChild(player1);
				newMatch.appendChild(scorePlayer1);
				newMatch.appendChild(player2);
				newMatch.appendChild(scorePlayer2);
				newMatch.appendChild(winner);
				
				// tbody.insertBefore(newMatch, tbody.firstChild);
				tbody.appendChild(newMatch);
			});
		}
	}

	async fillStats()
	{
		let URL = '/api/match/history/'+ this.UserDatas.id+'/';

		let response_matches_stats = await this.user.request.get(URL);

        if (response_matches_stats.ok)
        {
			let match_stat = await response_matches_stats.json();
			let stats = match_stat.stats;

			let nbMatchs = document.querySelector(".nb-matchs");
			let wonMatch = document.querySelector(".won-match");
			let lostMatch = document.querySelector(".lost-match");

			console.log("won: ", stats.win);
			console.log("lost: ", stats.lost);


			nbMatchs.innerHTML = stats.total;
			wonMatch.innerHTML = stats.win;
			lostMatch.innerHTML = stats.lost;

		}
	}

	async fillProfile()
	{
		if(!this.UserDatas)
			return;
		document.querySelector(".user_username").innerHTML = this.UserDatas.username;
		document.querySelector(".id").innerHTML = this.UserDatas.id;
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
