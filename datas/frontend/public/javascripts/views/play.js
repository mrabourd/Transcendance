import AbstractView from "./AbstractView.js";
import pongComputer from "../pongComputer.js";
import pongPlayer from "../pongPlayer.js";
import pongOnline from "../pongOnline.js";
import AbstractPong from "../AbstractPong.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
		this.match_id = this.params.match_id
        this.setTitle("Play Pong");
    }

    async getHtml(DOM) {
        await fetch('/template/play').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }

	addEvents () {
		let canvas = document.getElementById('canvas');

		// function resizeCanvas() {
		// 	canvas.width = window.innerWidth;
		// 	canvas.height = window.innerHeight;
		// }
			
		// window.addEventListener("resize", resizeCanvas);

		document.querySelector('#start-game').innerHTML = "Start game";
		document.querySelector('#stop-game').innerHTML = "Stop game";

		if (this.params.adversaire === "vs_computer"){
			this.pong = new pongComputer(canvas);
		}
		else if (this.params.adversaire === "vs_player"){
			this.pong = new pongPlayer(canvas);
		}
		else {
			this.pong = new pongOnline(canvas, this.user, this.match_id);
			this.pong.connect();
			this.PongSocket = this.pong.PongSocket
		}
		



		document.addEventListener("keydown", (event) => {
			if (!this.pong.currentKeysDown.includes(event.key)) {
				this.pong.currentKeysDown.push(event.key);
			}
			this.pong.movePaddles();
		})
		


		document.addEventListener("keyup", (event) => {
			this.pong.currentKeysDown.splice(this.pong.currentKeysDown.indexOf(event.key), 1)
			this.pong.movePaddles();
		})


		document.querySelector('#start-game').addEventListener('click',(e) =>
		{
			if (e.target.innerHTML =="Pause game") {
				this.pong.pause();
				e.target.innerHTML = "Start game";
			}
			else{
				this.pong.start();
				e.target.innerHTML = "Pause game";
			}
		});

		document.querySelector('#stop-game').addEventListener('click', this.pong.stop);
		
    }

}