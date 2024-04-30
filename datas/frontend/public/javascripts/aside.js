import * as utils from "./utils_form.js"

export async function print(user)
{
	let routes = null;

	if (user.isConnected)
	{
		let response = await user.request.get('/api/users/all/')
		document.getElementById("friends").innerHTML = "Here are my friends: (connected)"
		if (response.ok)
		{   
			const users = await response.json();
			
			
			let displayFriends = document.querySelector("#friends");
			users.forEach(list_user => {
				if (list_user.username === "root" || list_user.username === user.datas.username)
					return;
				let avatar = (list_user.avatar == undefined) ? '/avatars/default.png' : list_user.avatar;
				let main_div	= utils.FormcreateElement("div", ["aside"]);
				let row			= utils.FormcreateElement("row", ["row"], {"style":"padding: 20px; border-top: 1px solid #f1f2f2;"});
				let data		= utils.FormcreateElement("data", ["col-5"]);
				let follow		= utils.FormcreateElement("div", ["col-2"]);
				let msg			= utils.FormcreateElement("button", ["btn", "btn-primary"], {"innerText": "Follow!",
					"id": `followButton`,
					"type": "button"
				});
				let f_avatar  =  utils.FormcreateElement("img", ["col-3"], {"src": avatar, "style":"border-radius: 50%;"});
				let f_name = utils.FormcreateElement("div", ["h5"]);
				let f_link = utils.FormcreateElement("a", ["profile-link", "#href"], {"innerText": list_user.username});
				let f_status = utils.FormcreateElement("p", ["status"], {"innerText": "status:"}); //add status here
				utils.FormAppendElements(follow, msg);
				utils.FormAppendElements(data, f_name);
				utils.FormAppendElements(data, f_status);
				utils.FormAppendElements(row, f_avatar);
				utils.FormAppendElements(f_name, f_link);
				utils.FormAppendElements(row, data);
				utils.FormAppendElements(row, follow);
				utils.FormAppendElements(main_div, row);
				console.log("list_user avatar", list_user.username, avatar, list_user.isConnected);
				f_link.addEventListener('click', async () =>  {
			
					user.router.navigateTo("/profile/" + list_user.id, user);
				});

				displayFriends.appendChild(main_div);
				
				document.getElementById("followButton").addEventListener("click", async() => {
					let RQ_Body = {}
					let value =  document.getElementById("followButton").innerText;
					if (value === "Follow!"){
						console.log("I want to follow: ", list_user.username)
						document.getElementById("followButton").innerText = "Unfollow"
						
						// add follow
						let response = await user.request.post('/api/users/follow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
						}
						else{
							console.log("response not okay")
						}
					}
					if (value === "Unfollow"){
						console.log("I want to UNfollow: ", list_user.username)
						document.getElementById("followButton").innerText = "Follow!"
						// add unfollow

						let response = await user.request.post('/api/users/unfollow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
						}
						else{
							console.log("response for unfollow not okay")
						}
					}
				});

				
			}); 
			
			return true;
		} else if (response.status === 401) {
			const users = await response.json();
			return users.detail;
		}
		
	}else{
		console.log("print aside not connected")
		document.getElementById("friends").innerHTML = "(not connected)"
		
	}
}


/*
REFRESH TOKEN 
const fetch = require('node-fetch');

async function refreshAccessToken(refreshToken) {
	const refreshTokenUrl = 'http://example.com/api/token/refresh/';

	try {
		const response = await fetch(refreshTokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				refresh: refreshToken
			})
		});

		if (response.ok) {
			const data = await response.json();
			const accessToken = data.access;
			console.log('Nouveau jeton d\'accès:', accessToken);
			return accessToken;
		} else {
			console.error('Erreur lors du rafraîchissement du jeton:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Erreur lors du rafraîchissement du jeton:', error.message);
		return null;
	}
}

// Utilisation de la fonction refreshAccessToken avec le jeton de rafraîchissement
const refreshToken = 'votre_refresh_token_ici'; // Remplacez par le véritable jeton de rafraîchissement
refreshAccessToken(refreshToken);
*/