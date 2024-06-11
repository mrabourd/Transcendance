import AbstractView from "./AbstractView.js";
import * as friends_utils from "../utils_friends.js";

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Chat");

	}

	async getHtml(DOM) {
		try {

			DOM.innerHTML = this.user.TemplateChat.innerHTML;

			/* get friend history */
			this.friend_id = this.params.friend_id; // Assuming 'this' refers to the proper context here.
			let response = await this.user.request.get('/api/users/profile/'+this.friend_id+'/')
			let friend = await response.json();
			this.friend_username = friend.username;
			
			var chat_with = document.querySelector("#app .chat-with");
			var nodeFriend = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, friend.id);
			friends_utils.update_status_text(nodeFriend)

			// DOM = this.user.DOMMpChatMessage.cloneNode(true)

			chat_with.appendChild(nodeFriend);
			chat_with.querySelector('.profile_card').classList.remove('mb-2')
			/* get message history */
			let historyResponse = await this.user.request.get(`/api/users/chat/messages/history/${this.friend_id}/`);
			/* TODO -> createChatMessage for each */
			// this.messageHistory = this.historyJSON(historyResponse);

			// if (friends_utils.is_blocked(this.user, this.friend_id) != undefined){
			// 	document.querySelector(".message").classList.add("text-secondary")
			// }
			this.historyJSON(historyResponse);

			
		} catch (err) {
			console.warn('Something went wrong.', err);
		}

	}

	checkIfBlock () {
		const user = this.user;
		if (friends_utils.is_blocked_by(user, this.friend_id) == true ||
				friends_utils.is_blocked(user, this.friend_id) == true){
			document.getElementById("chat-message-input").classList.add("d-none")
			document.getElementById("chat-message-submit").classList.add("d-none")
			return true;
		}
		else {
			document.getElementById("chat-message-input").classList.remove("d-none")
			document.getElementById("chat-message-submit").classList.remove("d-none")
			return false;
		}
	}

	async addEvents() {
		const user = this.user;
		

		if (this.chatSocket == null) {
			this.chatSocket = new WebSocket(
				this.user.request.url_wss + '/ws/msg/'+ this.friend_id +'/?token=' + user.request.getJWTtoken()["access"]
			);


			// on socket open
			this.chatSocket.onopen = (e) => {
			};
			this.chatSocket.onclose = function(e) {
				// TODO reconnect 
			};


			// on socket close
			this.chatSocket.onmessage = (e) => {
				const data = JSON.parse(e.data);
				if (data.message == `\n`){
					return;
				}
				else{
					this.createChatMessage(data, this.user.datas.id, 1);
				}
				//const chatText = document.querySelector('#chat-text-left').innerHTML;
				//document.querySelector('#chat-text-left').innerHTML = chatText + data.created_at + '<br>' + data.username + ' : ' + data.message;

			};
		}


        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.key === 'Enter') {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };
        document.querySelector('#chat-message-submit').onclick = (e) => {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            this.chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };
	}

	formatDate = (dateString) => {
		const options = { hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleTimeString('fr-FR', options);
	}

	historyJSON = async (history) => {
		let messageHistory = await history.json();
		let currentUser = this.user.datas.id;
		if (messageHistory.length > 0){
			messageHistory.forEach(message => {

				this.createChatMessage({
					...message,
					user_id: message.user,
					message: message.message.trim(),
					created_at: this.formatDate(message.created_at)
				}, currentUser, 2);
				
			});
		}
	}



	displayRight = (data, time, text, DOM) => {

		let chatbox = document.querySelector("#app .overflow-scroll");

		// document.querySelector(".chat_message").classList.add("bg-info")
		time.classList.add('d-flex', 'flex-row', 'justify-content-end')
		text.classList.add('d-flex', 'flex-row', 'justify-content-end')
		text.innerHTML = data.message;
		time.innerHTML = time.innerText;

		chatbox.scrollTop = document.querySelector(".endofscroll").offsetTop
	}

	displayLeft = (data, time, text, DOM) => {
		let chatbox = document.querySelector("#app .overflow-scroll");

		text.innerHTML = data.message

		chatbox.scrollTop = document.querySelector(".endofscroll").offsetTop
		document.querySelector('#chat-message-input')
	}

	createChatMessage = (data, currentUser, isHist) => {
		let DOM = this.user.DOMMpChatMessage.cloneNode(true)

		let canTalk = this.checkIfBlock();
		if (canTalk == true && isHist == 1){
			return;
		}

		if (data.message == ""){
			return;
		}

		/* TO DO remlir le DOM */
		
		const date = new Date();
		const hour = date.getHours();
		const min = date.getMinutes();
		let time = DOM.querySelector(".hour");

		time.innerHTML = hour+":"+min;
	
		let side = data.user_id === currentUser ? 'right' : 'left';
		
		let text = DOM.querySelector(".message");

		if (side == 'right') {
			this.displayRight(data, time, text, DOM)
			// document.querySelector("#app .overflow-scroll ul").appendChild(DOM)
		}
		else {
			if (location.pathname == '/chatroom/' + this.friend_id){
				this.displayLeft(data, time, text, DOM)

			}
			else{
				return;
			}
		}
		document.querySelector("#app .overflow-scroll ul").appendChild(DOM)


	}
};

