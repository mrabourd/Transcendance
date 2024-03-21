export default function login42 () {
	console.log("login42 called")

	const authorizeUrl = 'https://api.intra.42.fr/oauth/authorize';

	// Paramètres requis pour l'autorisation (client_id, redirect_uri, etc. a ajouter : scope, state, etc.)
	const clientId = 'client_id'; // Remplacez cela par votre propre client_id
	const redirectUri = 'https://localhost:3000/callback'; // Remplacez cela par votre propre URI de redirection
	// Construire l'URL d'autorisation avec les paramètres requis
	const formattedUrl = `${authorizeUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

	// Rediriger l'utilisateur vers l'URL d'autorisation
	window.location.href = formattedUrl;
}