import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("home");

    }
    async getHtml(DOM) {
        await fetch('/template/chatroom').then(function (response) {
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
		//let headers = await this.user.request.get_request_header();
		
        const chatSocket = new WebSocket('wss://localhost:8443/ws/msg/general/?token=' + this.user.request.getJWTtoken()["access"]);
		//https://echo.websocket.org/
		//const chatSocket = new WebSocket('wss://echo.websocket.org/');
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            document.querySelector('#chat-log').value += (data.message + '\n');
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

/*     addEvents () {
        const webSocket = new WebSocket('ws://127.0.0.1:8443/ws/msg/');
        webSocket.onmessage = (event) => {
            console.log("onmessage:", event)
            document.getElementById('messages').innerHTML += `<div class="received-message"><p>` + event.data + `</p></div>`;
	@@ -29,7 +59,7 @@ export default class extends AbstractView {
            console.log("We are connected");
        });
        document.getElementById('input-form').addEventListener('submit', this.sendMessageCallback(webSocket));
    }
    sendMessageCallback = (webSocket) => {
	@@ -43,8 +73,8 @@ export default class extends AbstractView {
        event.preventDefault();
        let inputMessage = document.getElementById('message');
        webSocket.send(this.user.datas.username + `: ` + inputMessage.value)
        document.getElementById('messages').innerHTML +=
        `<div class="sent-message"><p>` + inputMessage.value + `</p></div>`;
        inputMessage.value = ""
    } */
}