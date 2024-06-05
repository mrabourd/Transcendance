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
			this.print_scores();
            //console.log(`ball [${this._game["ball"]["x"]}][${this._game["ball"]["y"]}]`)
            //console.log('player right :', data.player_right.y)
		}
    }
	print_scores = () => {
		document.querySelector('#app .scores .playerleft .username').innerHTML = this._game["playerleft"]["username"]
		document.querySelector('#app .scores .playerleft .score').innerHTML = this._game["playerleft"]["score"]

		document.querySelector('#app .scores .playerright .username').innerHTML = this._game["playerright"]["username"]
		document.querySelector('#app .scores .playerright .score').innerHTML = this._game["playerright"]["score"]

	}
	draw = () => {
		let context = this._canvas.getContext('2d');
		let canvas = this._canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// background
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
	
		// filet
		context.fillStyle = 'white';
		context.fillRect(canvas.width / 2, 0,  1, canvas.height);
	
		// balle
		const ballX = (this._game["ball"]["x"] / 100) * canvas.width;
		const ballY = (this._game["ball"]["y"] / 100) * canvas.height;
		const ballRadius = (this._game["ball"]["r"] / 100) * canvas.height;
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
		context.fill();

		// paddlles
		const paddleHeight = (this._game["paddles"]["height"] / 100) * canvas.height;
		const paddleWidth = (this._game["paddles"]["width"] / 100) * canvas.width;
		
		const paddle_left_Y = (this._game["playerleft"]["y"] / 100) * canvas.height;
		const paddle_right_Y = (this._game["playerright"]["y"] / 100) * canvas.height;

		context.fillRect(1, paddle_left_Y, paddleWidth, paddleHeight);
		context.fillRect(canvas.width - paddleWidth -1 , paddle_right_Y, paddleWidth, paddleHeight);
	}
	

	movePaddles() {
		window.addEventListener("keydown", async (e) => {
			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}, false);
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