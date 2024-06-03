import AbstractPong from "./AbstractPong.js";

const PLAYER_HEIGHT = 100;

export default class pongOnline extends AbstractPong {
	constructor(params) {
		super(params);
		console.log(params);
		this.user = params.user;
		console.log("user in online: ", this.user);
		this.currentKeysDown = [];
		this.winner = false;
		this.websocket = new WebSocket(this.user.request.url_wss + '/ws/pong/&token=' + this.user.request.getJWTtoken()["access"] );

		this.websocket.onopen = function(e) {
			console.log('Socket connected for online pong.');
		};

		this.websocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			if (data.type === 'move') {
				if (data.player === 'player2') {
					if (data.direction === 'up') {
						this.rightPaddleMoveUp();
					} else if (data.direction === 'down') {
						this.rightPaddleMoveDown();
					}
				} else if (data.player === 'player1') {
					if (data.direction === 'up') {
						this.leftPaddleMoveUp();
					} else if (data.direction === 'down') {
						this.leftPaddleMoveDown();
					}
				}
			}
		}

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


	playerRightMove() {
		// console.log("computer not playing this time");
        // this._game.computer.y += this._game.ball.speed.y * 0.85;
    }

	sendMove(player, direction) {
		this.websocket.send(JSON.stringify({
			'type': 'move',
			'player': player,
			'direction': direction
		}));
	}
    
}