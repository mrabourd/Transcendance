let canvas;
let game;
let anim;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

export default class PongClass {

    constructor() {
        console.log("Pong Constructor called");
        this._canvas = document.getElementById('canvas');
        this._game = {
            player: {
                y: this._canvas.height / 2 - PLAYER_HEIGHT / 2,
                score: 0
            },
            computer: {
                y: this._canvas.height / 2 - PLAYER_HEIGHT / 2,
                score: 0
            },
            ball: {
                x: this._canvas.width / 2,
                y: this._canvas.height / 2,
                r: 5,
                speed: {
                    x: 2,
                    y: 2
                }
            }
        }


        let ANIMATION = {};
        
        const start = (fps) => {
            console.log("start")
            cancelAnimationFrame(ANIMATION.id);
            loop();
        }
        
        const doOneFrame = () => {
            console.log("doOneFrame")
            // whole game exists here.
        }
        const loop = () => {
            console.log("loop")
            doOneFrame()
            ANIMATION.id = requestAnimationFrame(loop);
        }
        start()



    }



    draw() {
        console.log("draw");
        let context = this._canvas.getContext('2d');
    
        context.fillStyle = 'black';
        context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(this._canvas.width / 2, 0);
        context.lineTo(this._canvas.width / 2, this._canvas.height);
        context.stroke();
    
        context.fillStyle = 'white';
        context.fillRect(0, this._game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        context.fillRect(this._canvas.width - PLAYER_WIDTH,
            this._game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    
        context.beginPath();
        context.fillStyle = 'white';
    
        context.arc(this._game.ball.x,
            this._game.ball.y, this._game.ball.r, 0, Math.PI * 2, false);
        context.fill();
    }


    setToCenter(){
        this._game.ball.x = this._canvas.width / 2;
        this._game.ball.y = this._canvas.height / 2;
        this._game.player.y = this._canvas.height / 2 - PLAYER_HEIGHT / 2;
        this._game.computer.y = this._canvas.height / 2 - PLAYER_HEIGHT / 2;
    
        this._game.ball.speed.x = 2;
    }
    
    collide(player) {
        if (this._game.ball.y < player.y || this._game.ball.y > player.y + PLAYER_HEIGHT) {
            this.setToCenter();
            if (player == this._game.player) {
                this._game.computer.score++;
                document.querySelector('#computer-score').textContent = this._game.computer.score;
            }
            else {
                this._game.player.score++;
                document.querySelector('#player-score').textContent = this._game.player.score;
            }
        }
        else {
            this._game.ball.speed.x *= -1.2;
            this.ChangeDirection(player.y);
        }
    
    }
    
    ChangeDirection (playerPosition) {
        let impact = this._game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
        let ratio = 100 / (PLAYER_HEIGHT / 2);
    
        // Math.round = return the value of a nb rounded to the nearest int
        this._game.ball.speed.y = Math.round(impact * ratio / 10);
    }
    
    
    playerMoveKey(event) {
        if (event)
        {
        if (event.key === "ArrowDown"){
            if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height)
                this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
                this._game.player.y += 25;
        }
        else if (event.key === "ArrowUp"){
            if(this._game.player.y < PLAYER_HEIGHT / 2)
                this._game.player.y = 0;
                this._game.player.y -= 25;
        }
    }
    }
    
    ballMove() {
        if (this._game.ball.y > this._canvas.height || this._game.ball.y < 0) {
            this._game.ball.speed.y *= -1;
        }
    
        if (this._game.ball.x > this._canvas.width - PLAYER_WIDTH) {
            this.collide(this._game.computer);
        }
        else if (this._game.ball.x < PLAYER_WIDTH) {
            this.collide(this._game.player);
        }
    
        this._game.ball.x += this._game.ball.speed.x;
        this._game.ball.y += this._game.ball.speed.y;
    }
    
    computerMove() {
        this._game.computer.y += this._game.ball.speed.y * 0.85;
    }
    
    play_again(){
        console.log("play_again")
    }
    play() {
        console.log("play")
        this.draw;
    
        this.computerMove;
        this.ballMove;
    
        this._anim = requestAnimationFrame(this.play());
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion

    _stop() {
            cancelAnimationFrame(this._anim);
    
        this.setToCenter;
    
        this._game.ball.speed.y = 2;
    
        this._game.computer.score = 0;
        this._game.computer.player = 0;
    
        document.querySelector('#computer-score').textContent = this._game.computer.score;
        document.querySelector('#player-score').textContent = this._game.player.score;
    
        this.draw();
    }
  }