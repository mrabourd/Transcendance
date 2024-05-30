import AbstractView from "./AbstractView.js";
import pongComputer from "../pongComputer.js";
import pongPlayer from "../pongPlayer.js";
import pongOnline from "../online.js";
import AbstractPong from "../AbstractPong.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play PlayJS");
        // this.currentKeysDown = [];
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
		let playerleft_score = document.getElementById('player-score');
		let playerright_score = document.getElementById('computer-score');

		console.log("user:", this.user);
		// function resizeCanvas() {
		// 	canvas.width = window.innerWidth;
		// 	canvas.height = window.innerHeight;
		// }
			
		// window.addEventListener("resize", resizeCanvas);

		document.querySelector('#start-game').innerHTML = "Start game";
		document.querySelector('#stop-game').innerHTML = "Stop game";

		if (this.params.adversaire === "vs_computer"){
			this._game = new pongComputer(canvas, playerleft_score, playerright_score);
		}
		else if (this.params.adversaire === "vs_player"){
			this._game = new pongPlayer(canvas, playerleft_score, playerright_score);
		}
		else {
			this._game = new pongOnline(canvas, playerleft_score, playerright_score, this.user);
			console.log("vs user id: creer avec websocket");
		}
		
		document.addEventListener("keydown", (event) => {
			if (!this._game.currentKeysDown.includes(event.key)) {
				this._game.currentKeysDown.push(event.key);
			}
			this._game.movePaddles();
		})
		
		document.addEventListener("keyup", (event) => {
			this._game.currentKeysDown.splice(this._game.currentKeysDown.indexOf(event.key), 1)
			
			this._game.movePaddles();
		})
		document.querySelector('#start-game').addEventListener('click',(e) =>
		{
			if (e.target.innerHTML =="Pause game") {
				this._game.pause();
				e.target.innerHTML = "Start game";
			}
			else{
				this._game.start();
				e.target.innerHTML = "Pause game";
			}
		});

		document.querySelector('#stop-game').addEventListener('click', this._game.stop);
		
    }

}