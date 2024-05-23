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
			this.rightPaddleMoveUp();
		} else if (
			this.currentKeysDown.includes("w") 
		) {
			this.rightPaddleMoveDown();
		}
		
		// PlayerTwo&RightSide
		if (this.currentKeysDown.includes('ArrowUp')) {
			this.leftPaddleMoveUp();
		} else if (this.currentKeysDown.includes('ArrowDown')) {
			this.leftPaddleMoveDown();
		}
	}
	
	leftPaddleMoveUp() {
		if(this._game.computer.y < PLAYER_HEIGHT / 2){
			this._game.computer.y = 0;
		}
		this._game.computer.y -= 10;
	}
	
	leftPaddleMoveDown() {
		if (this._game.computer.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.computer.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.computer.y += 10;
	}
	
	rightPaddleMoveUp() {
		if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.player.y += 10;
	}
	
	rightPaddleMoveDown() {
		if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.player.y -= 10;
	}


	computerMove() {
		// console.log("computer not playing this time");
        // this._game.computer.y += this._game.ball.speed.y * 0.85;
    }
    
}