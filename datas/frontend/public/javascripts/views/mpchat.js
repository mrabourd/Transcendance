import AbstractView from "./AbstractView.js";

import { send_message } from "../utils_chat.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("home");

    }
    async getHtml(DOM) {
        await fetch('/template/mpchat').then(function (response) {
            return response.text();
        }).then(function (html) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });

    }

	async addEvents() {
		let friend_id = this.params.user_id;
    //console.log('datas',user.datas)
		console.log("send_message", this.user.datas.id)
		if (this.user.datas.id == friend_id) {
			return false
		}

		const chatSocket = new WebSocket(
			'wss://localhost:8443/ws/msg/'+ this.user.datas.id + friend_id +'?token=' + this.user.request.getJWTtoken()["access"] +'/'
		);

		// on socket open
		chatSocket.onopen = function (e) {
			console.log('Socket between ' + this.user.datas.id + ' and ' + friend_id + ' successfully connected.');
		};

		// on socket close
		chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
		


            document.querySelector('#chat-text-left').value = (data.user + " : " + data.message + '\n');
	
        };

        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
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

	
};

