import * as utils from "./utils_form.js"

export async function print(user)
{
	let routes = null;
   
	if (user.isConnected)
	{
        let response = await user.request.get('/api/users/all/')
        document.getElementById("friends").innerHTML = "Here are my friends: (connected)"
        console.log("print aside connected")
        if (response.ok)
        {   
            const users = await response.json();
            
            let displayFriends = document.querySelector("#friends");
            users.forEach(list_user => {
                list_user.avatar = (list_user.avatar == undefined) ? './avatars/default.png' : list_user.avatar
                let main_div       = utils.FormcreateElement("div", ["aside"]);
                let f_username = utils.FormcreateElement("p", ["aside-username"],{"innerText": list_user.username})
                let f_avatar  =  utils.FormcreateElement("img", ["aside-avatar"], {"src": list_user.avatar, "width":"25px"});
                let f_link  =  utils.FormcreateElement("a", ["aside-link"], {"innerText": 'view profile'});
                utils.FormAppendElements(main_div, f_username);
                utils.FormAppendElements(main_div, f_avatar);
                utils.FormAppendElements(main_div, f_link);
                console.log("list_user", list_user)
                f_link.addEventListener('click', async () =>  {
			
                    user.router.navigateTo("profile/" + list_user.id, user);
                });

                displayFriends.appendChild(main_div);
                //
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