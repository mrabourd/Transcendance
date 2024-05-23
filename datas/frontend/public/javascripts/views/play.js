import AbstractView from "./AbstractView.js";
import pongComputer from "../pongComputer.js";
import pongPlayer from "../pongPlayer.js";
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
		let player_score = document.getElementById('player-score');
		let computer_score = document.getElementById('computer-score');
		
		if (this.params.adversaire === "vs_computer"){
			this._game = new pongComputer(canvas, player_score, computer_score);
			// document.querySelector('#start-game').addEventListener('click',  this._game.computerMove);
		}
		else if (this.params.adversaire === "vs_player")
		{
			this._game = new pongPlayer(canvas, player_score, computer_score);
			// console.log("pong current key down: ", this._game.currentKeysDown);
			// document.addEventListener('keydown', this._game.secondPlayerMove);
		}
		else
		{
			console.log("vs user id: creer avec websocket")
		}
		

		document.querySelector('#start-game').addEventListener('click',  this._game.start);
		document.querySelector('#stop-game').addEventListener('click',  this._game.stop);

		// console.log("document.querySelector('#player-score').innerHTML: ", document.querySelector('#player-score').innerHTML)
		// if (document.querySelector('#player-score').textContent == 3)
		// 	this._game.displayWinner("player 1");

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

    }

}