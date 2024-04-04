import AbstractPong from "./AbstractPong.js";

const PLAYER_HEIGHT = 100;

export default class extends AbstractPong {
    constructor(params) {
        super(params);
    }

	playerMoveKey = (event) => {
		if (event)
		{
			if (event.key === "ArrowDown"){
				if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height){
					this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
				}
				this._game.player.y += 10;
			}
			if (event.key === "ArrowUp"){
				if(this._game.player.y < PLAYER_HEIGHT / 2){
					this._game.player.y = 0;
				}
				this._game.player.y -= 10;
			}

			if (event.key === "s"){
				if (this._game.computer.y + PLAYER_HEIGHT > this._canvas.height){
					this._game.computer.y = this._canvas.height - PLAYER_HEIGHT;
				}
				this._game.computer.y += 10;
			}
			if (event.key === "w"){
				if(this._game.computer.y < PLAYER_HEIGHT / 2){
					this._game.computer.y = 0;
				}
				this._game.computer.y -= 10;
			}
		}
	}

	computerMove() {
		// console.log("computer not playing this time");
        // this._game.computer.y += this._game.ball.speed.y * 0.85;
    }
    
}