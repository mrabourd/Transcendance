import AbstractPong from "./AbstractPong.js";

const PLAYER_HEIGHT = 100;

export default class extends AbstractPong {

	constructor(canvas, user, match_id) {
		super(canvas);
        this.user = user
        this.match_id = match_id
    }
	
	connect = () =>
    {
        console.log("PongSocket creation")
		const PongSocket = new WebSocket(
			this.user.request.url_wss+'/ws/pong/'+ this.match_id +'/?token=' + this.user.request.getJWTtoken()["access"]
		);

		PongSocket.onopen = function(e) {console.log('Socket connected for online pong.');};
		PongSocket.onclose = function(e) {console.warn('Socket connection closed ...');};

		PongSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
            console.log('pong : ', data)
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
			this.leftPaddleMoveUp();
		} else if (
			this.currentKeysDown.includes("w") 
		) {
			this.leftPaddleMoveDown();
		}
		
		// PlayerTwo&leftSide 
        /*
        if (this.currentKeysDown.includes('ArrowUp')) {
			this.rightPaddleMoveUp();
		} else if (this.currentKeysDown.includes('ArrowDown')) {
			this.rightPaddleMoveDown();
		}
        */
	}
	/*
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
    */
	
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
}