import * as router from "./router.js";
import * as friends_utils from "./utils_friends.js"
import {USER_STATUS} from "./constants.js";

export default class Websockets {
    constructor(user) {
		this.user = user
        console.log("websocket object create ()")

		// setup notification webscoket
		this.notifyScoket = new WebSocket(
			`wss://localhost:8443/ws/notify/?token=${this.user.request.getJWTtoken()['access']}`
		);
		// on socket open
		this.notifyScoket.onopen = function (e) {console.log('Socket successfully connected.');};
		// on socket close
		this.notifyScoket.onclose = function (e) {console.log('Socket closed');};

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
				this.update_status(data)
			}
			else if (data.message)
			{
				this.print_notification(data)
				router.router(this.user);
			}
				
			console.log('data.code:', data.code);
			console.log('WebSocket Received:', data);		
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

	async update_status(data)
	{
		let friend_id = data.sender
		let friend_status = data.message
		let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
		profile_cards.forEach(profile_card => {
			
			if (friend_status == USER_STATUS['OFFLINE'])
				profile_card.remove();
			else
			{
				profile_card.setAttribute('data-friend-status', friend_status);
				friends_utils.update_status_text(profile_card)
			}
		});
		if(friend_id == this.user.datas.id)
			return
		if (friend_status == USER_STATUS['ONLINE'])
		{
			let existing_thumbnail = document.querySelector(`aside .online ul .profile_card[data-friend-id="${friend_id}"]`);
			if (existing_thumbnail)
				return
			let response = await this.user.request.get('/api/users/profile/'+friend_id+'/')
			if (response.ok)
			{
				let friend = await response.json();
				let nodeCopy = await friends_utils.create_thumbnail(this.user.view.DOMProfileCard, this.user, friend)
				document.querySelector(`aside .online ul`).append(nodeCopy)
			}
		}
	}
}
