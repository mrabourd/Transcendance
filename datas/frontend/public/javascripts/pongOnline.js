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
		this.PongSocket = new WebSocket(
			this.user.request.url_wss+'/ws/pong/'+ this.match_id +'/?token=' + this.user.request.getJWTtoken()["access"]
		);
		this.PongSocket.onopen = function(e) {console.log('Socket connected for online pong.');};
		this.PongSocket.onclose = function(e) {console.warn('Socket connection closed ...');};
		this.PongSocket.onerror = function(e) {
			document.querySelector("#app").innerHTML = "An error occured ... WSS connection can be established"
		};

		this.PongSocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			if(data.error && data.error == 'token_not_valid')
			{
				let RefreshResponse = await this.user.request.refreshJWTtoken();
				if (RefreshResponse.ok)
					this.PongSocket = new Websockets(this.user)
				return;
			}
			this._game = data
			this.draw();
            //console.log('player left  :', data.player_left.y)
            //console.log('player right :', data.player_right.y)
		}
    }

	movePaddles() {
		window.addEventListener("keydown", async (e) => {
			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}, false);
		// PlayerOne&LeftSide
		/*
		if (this.currentKeysDown.includes("s")) {
			this.leftPaddleMoveUp();
		} else if (
			this.currentKeysDown.includes("w") 
		) {
			this.leftPaddleMoveDown();
		}
		*/
		// PlayerTwo&leftSide 
        
        if (this.currentKeysDown.includes('ArrowUp')) {
			this.rightPaddleMoveUp();
		} else if (this.currentKeysDown.includes('ArrowDown')) {
			this.rightPaddleMoveDown();
		}



	}
	
	rightPaddleMoveUp() {
		console.log("up")
		if(this._game.playerright.y < PLAYER_HEIGHT / 2){
			this._game.playerright.y = 0;
		}
		this._game.playerright.y -= 10;
		this.setPlayerRightValues(this._game.playerright.y);
		this.PongSocket.send(JSON.stringify({
			'message': "moveup"
		}));
	}
	
	rightPaddleMoveDown() {
		console.log("down")
		if (this._game.playerright.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerright.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerright.y += 10;
		this.setPlayerRightValues(this._game.playerright.y);
		this.PongSocket.send(JSON.stringify({
			'message': "movedowm"
		}));
	}
/*
	
	leftPaddleMoveUp() {
		console.log("up")
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y += 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
	}
	
	leftPaddleMoveDown() {
		console.log("down")
		if (this._game.playerleft.y + PLAYER_HEIGHT > this._canvas.height){
			this._game.playerleft.y = this._canvas.height - PLAYER_HEIGHT;
		}
		this._game.playerleft.y -= 10;
		this.setPlayerLeftValues(this._game.playerleft.y);
	}   
*/
}