import * as router from "./router.js";

export default class Websockets {
    constructor(user) {
		this.user = user
        console.log("websocket object create ()")
	

	// setup chat scoket
		this.notifyScoket = new WebSocket(
		'wss://localhost:8443/ws/notify/?token=' + this.user.request.getJWTtoken()['access']
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
		
		console.log('WebSocket data:', data);
		console.log('WebSocket message:', data.message);
		const message = data.message;

		

		// Call the setMessage function to add the new li element
		var newLi = document.createElement('li');

		// Create a new anchor element
		var newAnchor = document.createElement('a');
		newAnchor.className = 'dropdown-item text-wrap';
		newAnchor.href = '#';
		newAnchor.textContent = message;
		newLi.appendChild(newAnchor);
		var ulElement = document.getElementById('notify');
		ulElement.appendChild(newLi);

		router.router(this.user);
	};
    }

	print_notification()
	{
		
	}
}
