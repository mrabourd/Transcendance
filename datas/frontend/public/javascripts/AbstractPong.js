import AbstractView from "./views/AbstractView.js";

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

//https://lawrencewhiteside.com/courses/game-mechanics-in-javascript/the-game-loop/

export default class AbstractPong {

	constructor(canvas) {
		this._canvas = canvas;
		this.winner = false;
		//this._player_score = player_score;
		//this._computer_score = computer_score;

		//let canvas = document.getElementById('canvas');
		// this._playerleft_score = document.getElementById('playerleft-score')
		// this._playerright_score  = document.getElementById('playerright-score')

		this._game = {
			playerleft: {
				y: this._canvas.height / 2 - PLAYER_HEIGHT / 2,
				score: 0
			},
			playerright: {
				y: this._canvas.height / 2 - PLAYER_HEIGHT / 2,
				score: 0
			},
			ball: {
				x: this._canvas.width / 2,
				y: this._canvas.height / 2,
				r: 5,
				speed: {
					x: 2,
					y: 2
				}
			}
		}
		this.setPlayerLeftValues(180) 

		this.ANIMATION = {};
		
		this.draw();
		// this.pause();
		// this.stop();
	}

	setPlayerLeftValues(y) {
		this._game.playerleft.y = y;
	}

	setPlayerRightValues(y) {
		this._game.playerright.y = y;
	}

	getPlayerLeftValues() {
		return this._game.playerleft.y;
	}
	
	getPlayerRightValues() {
		return this._game.playerright.y;
	}

	checkScore = () => {
		document.querySelector("#winner").classList.add("h2");
		if (this._game && this._game.playerright.score === 2) {
			document.querySelector("#winner").classList.remove("d-none");
			document.querySelector("#winner").innerHTML = "The winner is player 2!";
			this.stop();
			return true;
		} else if (this._game && this._game.playerleft.score === 2) {
			document.querySelector("#winner").classList.remove("d-none");
			document.querySelector("#winner").innerHTML = "The winner is player 1!";
			this.stop();
			return true;
		}
		return false;
	}

	
	start = (fps) => {
		console.log("start")
		document.querySelector('#start-game').innerHTML = "Pause game";
		this._game.playerleft.score = 0;
		this._game.playerright.score = 0;
		this._playerleft_score = document.getElementById('playerleft-score')
		this._playerright_score  = document.getElementById('playerright-score')
		
		cancelAnimationFrame(this.ANIMATION.id);
		this.ANIMATION.fps = 60
		this.ANIMATION.fpsInterval = 1000 / this.ANIMATION.fps;
		this.ANIMATION.then = Date.now();
		this.ANIMATION.startTime = this.ANIMATION.then;
		this.ANIMATION.frameCount = 0;
		this.loop();

	}
	
	doOneFrame = () => {
		this.draw();
		this.playerLeftMove();
		this.ballMove();
	}

	loop = () => {
		this.ANIMATION.now = Date.now();
		this.ANIMATION.elapsed = this.ANIMATION.now - this.ANIMATION.then;
		this.ANIMATION.sinceStart = this.ANIMATION.now - this.ANIMATION.startTime;
		this.ANIMATION.currentFPS = (Math.round(1000 / (this.ANIMATION.sinceStart / ++this.ANIMATION.frameCount) * 100) / 100).toFixed(2);
		if (this.ANIMATION.elapsed > this.ANIMATION.fpsInterval) {
			this.doOneFrame()  // whole game, right here.
			this.ANIMATION.then = this.ANIMATION.now - (this.ANIMATION.elapsed % this.ANIMATION.fpsInterval);  // After everything.
		}
		this.winner = this.checkScore();
		if (this.winner == true){
			this.stop();
			return;
		}
		this.ANIMATION.id = requestAnimationFrame(() => this.loop());
	}

	draw = () => {
		let context = this._canvas.getContext('2d');
	
		context.fillStyle = 'black';
		context.fillRect(0, 0, this._canvas.width, this._canvas.height);
	
		context.strokeStyle = 'white';
		context.beginPath();
		context.moveTo(this._canvas.width / 2, 0);
		context.lineTo(this._canvas.width / 2, this._canvas.height);
		context.stroke();
	
		context.fillStyle = 'white';
		context.fillRect(0, this._game.playerleft.y, PLAYER_WIDTH, PLAYER_HEIGHT);
		context.fillRect(this._canvas.width - PLAYER_WIDTH,
			this._game.playerright.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	
		context.beginPath();
		context.fillStyle = 'white';
	
		context.arc(this._game.ball.x,
			this._game.ball.y, this._game.ball.r, 0, Math.PI * 2, false);
		context.fill();
	}


	setToCenter(){
		this._game.ball.x = this._canvas.width / 2;
		this._game.ball.y = this._canvas.height / 2;
		this._game.playerleft.y = this._canvas.height / 2 - PLAYER_HEIGHT / 2;
		this._game.playerright.y = this._canvas.height / 2 - PLAYER_HEIGHT / 2;
	
		this._game.ball.speed.x = 2;
	}
	
	collide(player) {
		this._game.playerleft.y = this.getPlayerLeftValues();
		this._game.playerright.y = this.getPlayerRightValues();
		if (this._game.ball.y < player.y || this._game.ball.y > player.y + PLAYER_HEIGHT) {
			this.setToCenter();
			if (player == this._game.playerleft) {
				this._game.playerright.score++;
				this._playerright_score.textContent = this._game.playerright.score;
			}
			else {
				this._game.playerleft.score++;
				this._playerleft_score.textContent = this._game.playerleft.score;

			}
		}
		else {
			this._game.ball.speed.x *= -1.2;
			this.ChangeDirection(player.y);
		}
		
	}
	
	ChangeDirection (playerPosition) {
		let impact = this._game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		let ratio = 100 / (PLAYER_HEIGHT / 2);
	
		// Math.round = return the value of a nb rounded to the nearest int
		this._game.ball.speed.y = Math.round(impact * ratio / 10);
	}
	
	
	
	ballMove = () => {
		this._game.playerleft.y = this.getPlayerLeftValues();
		this._game.playerright.y = this.getPlayerRightValues();
		if (this._game.ball.y > this._canvas.height || this._game.ball.y < 0) {
			this._game.ball.speed.y *= -1;
		}
	
		if (this._game.ball.x > this._canvas.width - PLAYER_WIDTH) {
			this.collide(this._game.playerright);
			
		}
		else if (this._game.ball.x < PLAYER_WIDTH) {
			this.collide(this._game.playerleft);
		}
	
		this._game.ball.x += this._game.ball.speed.x;
		this._game.ball.y += this._game.ball.speed.y;
	}

	pause = () => {
		console.log("pause");
		if (document.querySelector('#start-game').innerHTML == "Pause game"){
			document.querySelector('#start-game').innerHTML = "Start game";
		}
		cancelAnimationFrame(this.ANIMATION.id);
	
	
		this._game.ball.speed.y = 2;
	
	
		// this._playerright_scorsContent = this._game.playerleft.score;
	
		this.draw();

	}

	stop = () => {
		console.log("stop");
		document.querySelector('#start-game').innerHTML = "Start game";
		document.getElementById('playerleft-score').innerHTML = 0;
		document.getElementById('playerright-score').innerHTML = 0;
		cancelAnimationFrame(this.ANIMATION.id);
	
		this.setToCenter();
			
		this._game.ball.speed.y = 2;
	
		this._game.playerright.score = 0;
		this._game.playerleft.score = 0;
	
		// this._playerright_scorsContent = this._game.playerleft.score;
	
		this.draw();

	}

}