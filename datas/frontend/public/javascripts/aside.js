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
            // const users = await response.json();
            
            // users.forEach(user => {
                console.log("users:", user[0].username);
                
            // })


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