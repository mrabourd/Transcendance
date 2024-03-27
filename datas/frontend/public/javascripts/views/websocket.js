import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("home");
    }

    async getHtml(DOM) {
        await fetch('/template/websocket').then(function (response) {
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

    addEvents () {
        const webSocket = new WebSocket('ws://localhost:8080/');
        webSocket.onmessage = (event) => {
            console.log("onmessage:", event)
            document.getElementById('messages').innerHTML += 'Message from server: ' + event.data + "<br>";
        };
        webSocket.addEventListener("open", () => {
            console.log("We are connected");
        });
        document.getElementById('input-form').addEventListener('submit', this.sendMessageCallback(webSocket));
  
    }

    sendMessageCallback = (webSocket) => {
        return async (event) => {
            await this.sendMessage(event, webSocket);
        };
    };
    sendMessage = async(event, webSocket) => {
        console.log("sending message");

        event.preventDefault();
        var inputMessage = document.getElementById('message');
        webSocket.send(inputMessage.value)
        inputMessage.value = "" 
    }
}
