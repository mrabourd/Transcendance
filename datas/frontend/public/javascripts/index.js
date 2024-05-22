import User from "./user.js";
import * as router from "./router.js";
import * as friends_utils from "./utils_friends.js"

window.addEventListener("popstate", router.router);

document.addEventListener("DOMContentLoaded", async() => {

    const user = new User();
    const result = await user.checkLocalStorage();
    
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            router.navigateTo(e.target.href, user);
        }
        if (e.target.matches("[logout]")) {
            e.preventDefault();
            (async () => {
                await user.logout();
                router.navigateTo("/login", user);
            })();
            
        }
    });
    user.router = router
    router.router(user);

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Parcourez les nœuds ajoutés
            mutation.addedNodes.forEach(function(node) {
                // Vérifiez si le nœud ajouté est une div avec la classe profile_card
                if (node instanceof HTMLElement && node.classList.contains('profile_card')) {
                    friends_utils.update_profile_cards(user, node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

	// setup chat scoket
	const notifyScoket = new WebSocket(
		'wss://localhost:8443/ws/notify/?token=' + user.request.getJWTtoken()["access"] +'/'
	);

	// on socket open
	notifyScoket.onopen = function (e) {
		console.log('Socket successfully connected.');
	};

	// on socket close
	notifyScoket.onclose = function (e) {
		console.log('Socket closed unexpectedly');
	};

	// on receiving message on group
	notifyScoket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const message = data.message;
		// Call the setMessage function to add the new li element
		var newLi = document.createElement('li');

		// Create a new anchor element
		var newAnchor = document.createElement('a');
		newAnchor.className = 'dropdown-item text-wrap';
		newAnchor.href = '#';
		newAnchor.textContent = message;

		// Append the anchor element to the li element
		newLi.appendChild(newAnchor);

		// Get the ul element with the id "notify"
		var ulElement = document.getElementById('notify');

		// Append the new li element to the ul element
		ulElement.appendChild(newLi);

		// getting object of count
		count = document.getElementById('bellCount').getAttribute('data-count');
		document.getElementById('bellCount').setAttribute('data-count', parseInt(count) + 1);

	};

});