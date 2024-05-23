import AbstractPong from "./AbstractPong.js";

const PLAYER_HEIGHT = 100;

export default class extends AbstractPong {
    constructor(params) {
        super(params);
    }

    playerMoveKeyDown = (event) => {
		if (event)
		{
			window.addEventListener("keydown", function(e) {
				if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
					e.preventDefault();
				}
			}, false);
			if (event.key === "ArrowDown"){
				if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height){
					this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
				}
				this._game.player.y += 10;
			}
			else if (event.key === "ArrowUp"){
				if(this._game.player.y < PLAYER_HEIGHT / 2){
					this._game.player.y = 0;
				}
				this._game.player.y -= 10;
			}
        }
    }

    computerMove() {
        // console.log("this._game.ball.speed.y:",this._game.ball.speed.y);
        this._game.computer.y += this._game.ball.speed.y * 0.85;
    }

    
}