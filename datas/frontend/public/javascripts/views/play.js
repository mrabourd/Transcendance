import AbstractView from "./AbstractView.js";
import pongComputer from "../pongComputer.js";
import pongPlayer from "../pongPlayer.js";



export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play PlayJS");
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
        let player_score = document.getElementById('player-score')
        let computer_score = document.getElementById('computer-score')
        
        if (this.params.id === "vs_computer")
            this._game = new pongComputer(canvas, player_score, computer_score);
        else
            this._game = new pongPlayer(canvas, player_score, computer_score);

        document.querySelector('#start-game').addEventListener('click',  this._game.start);
        document.querySelector('#stop-game').addEventListener('click',  this._game.stop);
        document.addEventListener('keydown', this._game.playerMoveKey);
    }

}