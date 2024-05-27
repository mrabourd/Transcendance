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
	}
	
	rightPaddleMoveDown() {
		if (this._game.playerright.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerright.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerright.y += 10;
		this.setPlayerRightValues(this._game.playerright.y);
	}
	
	leftPaddleMoveUp() {
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y += 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
	}
	
	leftPaddleMoveDown() {
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y -= 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
	}


	playerLeftMove() {
		// console.log("computer not playing this time");
        // this._game.computer.y += this._game.ball.speed.y * 0.85;
    }
    
}