import * as router from "./router.js";
import * as friends_utils from "./utils_friends.js"

export default class Websockets {
    constructor(user) {
		this.user = user
        console.log("websocket object create ()")
	

	// setup chat scoket
		this.notifyScoket = new WebSocket(
		`wss://localhost:8443/ws/notify/?token=${this.user.request.getJWTtoken()['access']}&refresh=${this.user.request.getJWTtoken()['refresh']}`
	);
	// on socket open
	this.notifyScoket.onopen = function (e) {
		console.log('Socket successfully connected.');
	};

	// on socket close
	this.notifyScoket.onclose = function (e) {
		console.log('Socket closed unexpectedly');
	};


	// on receiving message on group
	this.notifyScoket.onmessage = async (e) => {
		const data = JSON.parse(e.data);
		if(data.error && data.error == 'token_not_valid')
		{
			let RefreshResponse = await this.user.request.refreshJWTtoken();
			if (RefreshResponse.ok)
				this.user.websockets = new Websockets(this.user)
			return;
		}
		
		if (data.code == "STA")
		{
			// upd user status
			this.update_status(data)
		}
		else if (data.message)
		{
			this.print_notification(data)
			router.router(this.user);
		}
			
		console.log('data.code:', data.code);
		console.log('WebSocket Received:', data);

		

		// Call the setMessage function to add the new li element
		// Create a new anchor element
		
	};
    }

	print_notification(data)
	{
		var newLi = document.createElement('li');
		var newAnchor = document.createElement('a');
		newAnchor.className = 'dropdown-item text-wrap';
		newAnchor.href = '#';
		newAnchor.textContent = data.message;
		newLi.appendChild(newAnchor);
		var ulElement = document.getElementById('notify');
		ulElement.appendChild(newLi);

		router.router(this.user);
	}

	update_status(data)
	{
		console.log('data.sender:', data.sender);

		let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${data.sender}"]`);

		profile_cards.forEach(profile_card => {
			console.log('>> data.message:', data.message);

			profile_card.setAttribute('data-friend-status', data.message);
			friends_utils.update_status_text(profile_card)
		});
	}
}
