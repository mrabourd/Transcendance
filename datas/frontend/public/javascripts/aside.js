export function print(user)
{
	let routes = null;
	if (user.isConnected)
	{
        console.log("print aside")
        let token = user.getLocalToken()
        const csrftoken = user.getCsrfToken();
        console.log("csrftoken : [", csrftoken, "]");
        console.log("token.access : [", token.access, "]");

        try {
            const response = fetch('https://127.0.0.1:8443/api/users/all/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer '${token.access}'`,
                    'X-CSRFToken': csrftoken,
                    'Origin': 'http://127.0.0.1:8080/',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ csrfmiddlewaretoken: csrftoken }) // Inclure le jeton CSRF dans le corps de la requête
            });
            console.log("Response :", response)
           // if (response.ok) {
           // }

        } catch (error) {
            console.error('user.logout : There was a problem :', error);
            throw error;
        }
	}else{
        console.log("print aside")
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