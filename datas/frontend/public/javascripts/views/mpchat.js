import AbstractView from "./AbstractView.js";
import * as friends_utils from "../utils_friends.js";
import { send_message } from "../utils_chat.js";



export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle("Chat");

	}

	async getHtml(DOM) {
		try {
			let response = await fetch('/template/mpchat');
			let html = await response.text();
			
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');
			let body = doc.querySelector('#app');
			DOM.innerHTML = body.innerHTML;

			/* get friend history */
			this.friend_id = this.params.friend_id; // Assuming 'this' refers to the proper context here.
			response = await this.user.request.get('/api/users/profile/'+this.friend_id+'/')
			let friend = await response.json();
			this.friend_username = friend.username;
			
			var chat_with = document.querySelector("#app .chat-with");
			var nodeFriend = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, friend.id)
			nodeFriend.classList.remove('mb-2', 'col-12');
			nodeFriend.classList.add('d-flex', 'row','justify-content-end', 'col-8');
			nodeFriend.querySelector(".dropdown").innerHTML = ''
			friends_utils.update_status_text(nodeFriend)

			// DOM = this.user.DOMMpChatMessage.cloneNode(true)

			chat_with.appendChild(nodeFriend);

			/* get message history */
			let historyResponse = await this.user.request.get(`/api/users/chat/messages/history/${this.friend_id}/`);
			/* TODO -> createChatMessage for each */
			// this.messageHistory = this.historyJSON(historyResponse);
			this.historyJSON(historyResponse);
			
		} catch (err) {
			console.warn('Something went wrong.', err);
		}

	}

	async addEvents() {

		
		//console.log('datas',user.datas)
		console.log("send_message", this.user.datas.id)
		
        /*
        if (this.user.datas.id == friend_id) {
			return false
		}
        */

		console.log(this.user.datas.username + ' is connected to the chatroom.');
		const user = this.user;
		this.chatSocket = new WebSocket(
			this.user.request.url_wss + '/ws/msg/'+ this.friend_id +'/?token=' + user.request.getJWTtoken()["access"]
		);

		// on socket open
		this.chatSocket.onopen = (e) => {
			console.log('Socket between ' + user.datas.id + ' and ' + this.friend_id + ' successfully connected.');
        };
        this.chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

		
		// on socket close
		this.chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
			console.log("data.message: ", data.message)
			console.log("data.id: ", data.id)
			if (data.message == `\n`){
				return;
			}
			else{
				this.createChatMessage(data, this.user.datas.id);
			}
			//const chatText = document.querySelector('#chat-text-left').innerHTML;
			//document.querySelector('#chat-text-left').innerHTML = chatText + data.created_at + '<br>' + data.username + ' : ' + data.message;

        };



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
		console.log(messageHistory.length);

		if (messageHistory.length > 0){
			messageHistory.forEach(message => {

				this.createChatMessage({
					...message,
					user_id: message.user,
					message: message.message.trim(),
					created_at: this.formatDate(message.created_at)
				}, currentUser);
				
			});
		}
	}



	displayRight = (data, time, text, DOM) => {

		let chatbox = document.querySelector("#app .overflow-scroll");

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
		// let element_to_scroll_to = document.getElementById("endofscroll");
		// document.querySelector("ul.chatContainerScroll").scrollTop(element_to_scroll_to.offsetTop);

		// element_to_scroll_to.scrollIntoView();
	}

	createChatMessage = (data, currentUser) => {
		let DOM = this.user.DOMMpChatMessage.cloneNode(true)

		if (data.message == ""){
			console.log("do not display");
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
				// console.log("send notif pls")
				return;
			}
		}
		document.querySelector("#app .overflow-scroll ul").appendChild(DOM)


	}
};

