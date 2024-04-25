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
            console.log("list_user data: ", users[1].username, users[1].avatar, users[1].isConnected);
            users.forEach(list_user => {
                let avatar = (list_user.avatar == undefined) ? './avatars/default.png' : list_user.avatar;
                let main_div       = utils.FormcreateElement("div", ["aside"]);
                let row = utils.FormcreateElement("row", ["row"], {"style":"padding: 20px; border-top: 1px solid #f1f2f2;"});
                let data = utils.FormcreateElement("data", ["col-5"]);
                let contact = utils.FormcreateElement("div", ["col-2"]);
                let msg = utils.FormcreateElement("button", ["btn-primary"], {"innerText": "msg"});
                let f_avatar  =  utils.FormcreateElement("img", ["col-3"], {"src": avatar, "style":"border-radius: 50%;"});
                let f_link = utils.FormcreateElement("a", ["username"], {"innerText": list_user.username});
                let f_status = utils.FormcreateElement("p", ["status"], {"innerText": "status:"});
                // utils.FormAppendElements(row, f_username);
                utils.FormAppendElements(contact, msg);
                utils.FormAppendElements(data, f_link);
                utils.FormAppendElements(data, f_status);
                utils.FormAppendElements(row, f_avatar);
                utils.FormAppendElements(row, data);
                utils.FormAppendElements(row, contact);
                utils.FormAppendElements(main_div, row);
                console.log("list_user avatar", list_user.username, avatar, list_user.isConnected);
                f_link.addEventListener('click', async () =>  {
			
                    user.router.navigateTo("/profile/" + list_user.id, user);
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