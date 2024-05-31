import AbstractView from "./AbstractView.js";

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
                document.querySelector("#app .chat-with").innerHTML = this.friend_username;

                /* get message history */
                let historyResponse = await this.user.request.get(`/api/users/chat/messages/history/${this.friend_id}/`);
                /* TODO -> createChatMessage for each */
                console.log("history", historyResponse);
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
		const chatSocket = new WebSocket(
			'wss://localhost:8443/ws/msg/'+ this.friend_id +'/?token=' + user.request.getJWTtoken()["access"]
		);

		// on socket open
		chatSocket.onopen = function (e) {
			console.log('Socket between ' + user.datas.id + ' and ' + this.friend_id + ' successfully connected.');
        };
        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

		
		// on socket close
		chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
			this.createChatMessage(data);
			//const chatText = document.querySelector('#chat-text-left').innerHTML;
			//document.querySelector('#chat-text-left').innerHTML = chatText + data.created_at + '<br>' + data.username + ' : ' + data.message;

        };



        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.key === 'Enter') {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };
        document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };
	}

	createChatMessage = (data) => {
        let DOM = this.user.DOMMpChatMessage.cloneNode(true)
        /* TO DO remlir le DOM */
        DOM.querySelector(".message").innerHTML = data.message
        document.querySelector("#app .overflow-scroll ul").appendChild(DOM)
        //return DOM
        /*
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        DOM.querySelector("#chat-hour-me").innerHTML = hour+":"+min;
        let side = 'left';
        const messageElement = document.createElement('div');
        messageElement.innerText = data.message;
        if (data.user_id == user_id) {
            
            side = 'right';
        }
        messageElement.classList.add(`chat-message-${side}`);
        document.querySelector(`#chat-text-${side}`).append(messageElement);
        */
    }
};

