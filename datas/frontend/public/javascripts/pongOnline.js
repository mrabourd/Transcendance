import AbstractPong from "./AbstractPong.js";
import * as friends_utils from "./utils_friends.js"

const PLAYER_HEIGHT = 100;

export default class extends AbstractPong {

	constructor(canvas, user, match_id) {
		super(canvas);
        this.user = user
		this.player_move =
		{
			"opp_up" : false,
			"opp_down": false,
			"up" : false,
			"down": false
		}
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
			await this.print_players();
			this.draw();
			this.print_scores();
            //console.log(`ball [${this._game["ball"]["x"]}][${this._game["ball"]["y"]}]`)
            //console.log('player right :', data.player_right.y)
		}

    }
	async print_players(){
		if (document.querySelector('#app .scores .playerleft').innerHTML == "")
		{
			let player_left_thumb = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, this._game["playerleft"]["id"], this._game["playerleft"]["username"])
			let player_right_thumb = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, this._game["playerright"]["id"], this._game["playerleft"]["username"])
			if (document.querySelector('#app .scores .playerleft').innerHTML == "")
				{
					document.querySelector('#app .scores .playerleft').appendChild(player_left_thumb)
					document.querySelector('#app .scores .playerright').appendChild(player_right_thumb)
					// If Anonymous
					document.querySelector('#app .scores .playerleft .username').innerHTML = this._game["playerleft"]["username"]
					document.querySelector('#app .scores .playerright .username').innerHTML = this._game["playerright"]["username"]
				}
		}
	}
	print_scores = () => {
		document.querySelector('#app .scores .playerleft .dropdown').innerHTML = this._game["playerleft"]["score"]
		document.querySelector('#app .scores .playerright .dropdown').innerHTML = this._game["playerright"]["score"]
	}

	print_winner = (context, canvas) => {
		let winner
		if (this._game["playerleft"]["score"] > this._game["playerright"]["score"])
			winner = this._game["playerleft"]["username"]
		else
			winner = this._game["playerright"]["username"]
		// Dessiner le texte
		context.fillText(`The winner is ${winner}`, canvas.width / 2, canvas.height / 2);
	}
	print_ping_player = (context, canvas) => {
		context.fillText(`Ping your opponent`, canvas.width / 2, canvas.height / 2);
	}
	draw = () => {
		let context = this._canvas.getContext('2d');
		let canvas = this._canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		if (this._game["infos"]["status"] != 1)
		{
			context.fillStyle = '#CCCCCC';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = '#000000'; // Couleur du texte
			context.font = '48px Arial'; // Police et taille du texte
			context.textAlign = 'center'; // Alignement du texte
			context.textBaseline = 'middle'; // Alignement vertical du texte
			if (this._game["infos"]["status"] == 2) // winner
				this.print_winner(context, canvas)
			else
				this.print_ping_player(context, canvas)

		   
			return 
		}

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
			if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}, false);
        if (this.currentKeysDown.includes('ArrowUp')) {
			this.player_move['up'] = true
			this.player_move['down'] = false
		} else if (this.currentKeysDown.includes('ArrowDown')) {
			this.player_move['down'] = true
			this.player_move['up'] = false
		}else{
			this.player_move['down'] = false
			this.player_move['up'] = false			
		}

        if (this.currentKeysDown.includes('s')) {
			this.player_move['opp_up'] = true
			this.player_move['opp_down'] = false
		} else if (this.currentKeysDown.includes('w')) {
			this.player_move['opp_down'] = true
			this.player_move['opp_up'] = false
		}else{
			this.player_move['opp_down'] = false
			this.player_move['opp_up'] = false			
		}
		this.PongSocket.send(JSON.stringify(this.player_move))

	}
}