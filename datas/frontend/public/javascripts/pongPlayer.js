import AbstractPong from "./AbstractPong.js";

const PLAYER_HEIGHT = 100;

export default class extends AbstractPong {
	constructor(params) {
		super(params);
		this.currentKeysDown = [];
    }
	
	  
	movePaddles() {
		window.addEventListener("keydown", function(e) {
			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}, false);
		// PlayerOne&LeftSide
		if (this.currentKeysDown.includes("s")) {
			this.leftPaddleMoveUp();
		} else if (
			this.currentKeysDown.includes("w") 
		) {
			this.leftPaddleMoveDown();
		}
		
		// PlayerTwo&leftSide
		if (this.currentKeysDown.includes('ArrowUp')) {
			this.rightPaddleMoveUp();
		} else if (this.currentKeysDown.includes('ArrowDown')) {
			this.rightPaddleMoveDown();
		}
	}
	
	rightPaddleMoveUp() {
		if(this._game.playerright.y < PLAYER_HEIGHT / 2){
			this._game.playerright.y = 0;
		}
		this._game.playerright.y -= 10;
		this.setPlayerRightValues(this._game.playerright.y);
		console.log("PLAYER_HEIGHT / 2: ", PLAYER_HEIGHT / 2);
		console.log("this._game.playerright.y: ", this._game.playerright.y);
		console.log("this._game.playerleft.y: ", this._game.playerleft.y);
	}
	
	rightPaddleMoveDown() {
		if (this._game.playerright.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerright.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerright.y += 10;
		this.setPlayerRightValues(this._game.playerright.y);
		console.log("this._game.playerright.y + PLAYER_HEIGHT: ", this._game.playerright.y + PLAYER_HEIGHT)
		console.log("this._game.ball.x: ", this._game.ball.x);
		console.log("this._game.playerright.y: ", this._game.playerright.y);
		console.log("this._game.playerleft.y: ", this._game.playerleft.y);
	}
	
	leftPaddleMoveUp() {
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y += 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
		console.log("this._game.playerleft.y: ", this._game.playerleft.y);
		console.log("this._game.ball.x: ", this._game.ball.x);
		console.log("this._game.playerright.y: ", this._game.playerright.y);
	}
	
	leftPaddleMoveDown() {
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y -= 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
		console.log("this._game.playerleft.y: ", this._game.playerleft.y);
		console.log("this._game.ball.x: ", this._game.ball.x);
	}

	// playerMoveKeyDown = (event) => {
	// 	if (event)
	// 	{
	// 		window.addEventListener("keydown", function(e) {
	// 			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
	// 				e.preventDefault();
	// 			}
	// 		}, false);
	// 		console.log("playing here")
	// 		// if (controller[event.keyCode]){
	// 		// 	controller[event.keyCode].pressed = true
	// 		// }

	// 		if (event.key === "ArrowDown"){
	// 			if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height){
	// 				this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
	// 			}
	// 			this._game.player.y += 10;
	// 		}
	// 		if (event.key === "ArrowUp"){
	// 			if(this._game.player.y < PLAYER_HEIGHT / 2){
	// 				this._game.player.y = 0;
	// 			}
	// 			this._game.player.y -= 10;
	// 		}

	// 		if (event.key === "s"){
	// 			if (this._game.computer.y + PLAYER_HEIGHT > this._canvas.height){
	// 				this._game.computer.y = this._canvas.height - PLAYER_HEIGHT;
	// 			}
	// 			this._game.computer.y += 10;
	// 		}
	// 		if (event.key === "w"){
	// 			if(this._game.computer.y < PLAYER_HEIGHT / 2){
	// 				this._game.computer.y = 0;
	// 			}
	// 			this._game.computer.y -= 10;
	// 		}
	// 	}
	// 	// A CHECKER:
	// 	// https://medium.com/@dovern42/handling-multiple-key-presses-at-once-in-vanilla-javascript-for-game-controllers-6dcacae931b7
	// }

	// playerMoveKeyUp = (event) => {
	// 	if (event)
	// 	{
	// 		window.addEventListener("keydown", function(e) {
	// 			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
	// 				e.preventDefault();
	// 			}
	// 		}, false);

	// 		if (controller[event.keyCode]){
	// 			controller[event.keyCode].pressed = false
	// 		}
	// 	}
	// }


	playerLeftMove() {
		// console.log("computer not playing this time");
        // this._game.computer.y += this._game.ball.speed.y * 0.85;
    }
    
}