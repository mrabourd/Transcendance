import * as router from "./router.js";
import * as friends_utils from "./utils_friends.js"
import {USER_STATUS} from "./config.js";

export default class Websockets {
    constructor(user) {
		this.user = user

		this.count = 0;
		// setup notification websocket
		this.notifySocket = new WebSocket(
			`wss://localhost:8443/ws/notify/?token=${this.user.request.getJWTtoken()['access']}`
		);
		// on socket open
		this.notifySocket.onopen = function (e) {
			//console.log('Socket successfully connected.');
		};
		// on socket close
		this.notifySocket.onclose = function (e) {
			//console.log('Socket closed');
		};

		// on receiving message on group
		this.notifySocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			if(data.error && data.error == 'token_not_valid')
			{
				let RefreshResponse = await this.user.request.refreshJWTtoken();
				if (RefreshResponse.ok)
					this.user.websockets = new Websockets(this.user)
				return;
			}
			
			if (data.code_name == "STA")
				this.update_status(data)
			
			if (data.code_name == "INV")
				this.update_invitation(data)

			// if (data.code_name == "MSG")
			// 	this.print_notification(data)

			if (data.message)
			{
				this.print_notification(data)
				//router.router(this.user);
			}
			
		};
    }

	print_notification(data)
	{

		// if (data.code_name == "INV"){
		// 	console.log("it is an invitation");
		// 	new accept = document.createElement('btn');
		// 	new deny = document.createElement('btn');
		// 	accept.classList.add("btn-primary", "btn-lg")
		// }
		this.count++;

		let countnotif = document.querySelector(".countnotif");
		countnotif.textContent = this.count;

		let notif = document.querySelector(".notif ul");

		var newLi = document.createElement('li');
		var newAnchor = document.createElement('a');
		newAnchor.classList.add("dropdown-item")

		// newAnchor.className = 'dropdown-item text-wrap';
		newAnchor.textContent = data.message;
		newLi.appendChild(newAnchor);
		notif.appendChild(newLi);
		// 

		newAnchor.addEventListener('click', async (e) => {
			e.preventDefault();
			this.user.router.navigateTo(data.link, this.user)
			this.count--;
		});
		// 
		// var ulElement = document.getElementById('notify');
		//
	}


	async update_invitation(data)
	{
		if (data.code_value == 1) // invitation received
		{
			if (!this.user.datas.received_invitations.includes(data.sender))
				this.user.datas.received_invitations.push(data.sender)
		}
		if (data.code_value == 2) // invitation cancelled
		{
			this.user.datas.received_invitations = this.user.datas.received_invitations.filter(id => id !== data.sender);
		}
		if (data.code_value == 3 || data.code_value == 4) // invitation denied or accepted
		{
			this.user.datas.invitations_sent = this.user.datas.invitations_sent.filter(id => id !== data.sender);
		}

		this.user.saveDatasToLocalStorage()
		friends_utils.update_profile_cards_text(this.user)
        if(location.pathname == '/home')
            this.user.router.router(this.user);
		/*
		if((action == "block") && (!user.datas.blocks.includes(friend_id)))
        {
            user.datas.blocks.push(friend_id);
        } else if (action == "unblock"){
        }
		*/
	}

	async update_status(data)
	{
		let friend_id = data.sender
		let friend_status = data.code_value
		let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
		if(friend_id == this.user.datas.id)
		{
			if (friend_status != 0 && friend_status != 1)
			{
				this.user.datas.status = friend_status;
				this.user.saveDatasToLocalStorage()
			}
			return 
		}
		
		profile_cards.forEach(profile_card => {
				profile_card.setAttribute('data-friend-status', friend_status);
		});

		friends_utils.update_profile_cards_text(this.user, friend_id)
		
		let existing_thumbnail = document.querySelector(`aside .online ul .profile_card[data-friend-id="${friend_id}"]`);
		if (existing_thumbnail && friend_status == USER_STATUS['OFFLINE'])
			existing_thumbnail.remove()

		if (!existing_thumbnail && friend_status == USER_STATUS['ONLINE'] && friend_id != this.user.datas.id)
		{			
			let nodeCopy = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, friend_id)
			document.querySelector(`aside .online ul`).append(nodeCopy)
		}
	}
}
