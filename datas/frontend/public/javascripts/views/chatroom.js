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
		
        const chatSocket = new WebSocket(this.user.request.url_wss + '/ws/msg/general/?token=' + this.user.request.getJWTtoken()["access"]);
		//https://echo.websocket.org/
		//const chatSocket = new WebSocket('wss://echo.websocket.org/');
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            document.querySelector('#chat-log').value += (data.username + " : " + data.message + '\n');
        };

        chatSocket.onclose = function(e) {
            // TODO reconnect chatSocket
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
}