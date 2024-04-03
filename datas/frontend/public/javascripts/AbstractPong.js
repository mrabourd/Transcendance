const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
//https://lawrencewhiteside.com/courses/game-mechanics-in-javascript/the-game-loop/

export default class AbstractPong {

    constructor(canvas, player_score, computer_score) {
        this._canvas = canvas;
        //this._player_score = player_score;
        //this._computer_score = computer_score;

        //let canvas = document.getElementById('canvas');
        this._player_score= document.getElementById('player-score')
        this._computer_score  = document.getElementById('computer-score')

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
        this.ANIMATION = {};
        this.draw()
        this.stop()
    }

    start = (fps) => {
        cancelAnimationFrame(this.ANIMATION.id);
        this.ANIMATION.fps = 60
        this.ANIMATION.fpsInterval = 1000 / this.ANIMATION.fps;
        this.ANIMATION.then = Date.now();
        this.ANIMATION.startTime = this.ANIMATION.then;
        this.ANIMATION.frameCount = 0;
        this.loop();
    }
    
    doOneFrame = () => {
        this.draw();
        this.computerMove();
        this.ballMove();
    }

    loop = () => {
        this.ANIMATION.now = Date.now();
        this.ANIMATION.elapsed = this.ANIMATION.now - this.ANIMATION.then;
        this.ANIMATION.sinceStart = this.ANIMATION.now - this.ANIMATION.startTime;
        this.ANIMATION.currentFPS = (Math.round(1000 / (this.ANIMATION.sinceStart / ++this.ANIMATION.frameCount) * 100) / 100).toFixed(2);
        if (this.ANIMATION.elapsed > this.ANIMATION.fpsInterval) {
          this.doOneFrame()  // whole game, right here.
          this.ANIMATION.then = this.ANIMATION.now - (this.ANIMATION.elapsed % this.ANIMATION.fpsInterval);  // After everything.
        }
        this.ANIMATION.id = requestAnimationFrame(() => this.loop());
    }

    draw = () => {
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
                this._computer_score.textContent = this._game.computer.score;
            }
            else {
                this._game.player.score++;
                this._player_score.textContent = this._game.player.score;
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
    
    
    playerMoveKey = (event) => {
        if (event)
        {
        if (event.key === "ArrowDown"){
            if (this._game.player.y + PLAYER_HEIGHT > this._canvas.height)
                this._game.player.y = this._canvas.height - PLAYER_HEIGHT;
                this._game.player.y += 10;
        }
        else if (event.key === "ArrowUp"){
            if(this._game.player.y < PLAYER_HEIGHT / 2)
                this._game.player.y = 0;
                this._game.player.y -= 10;
        }
    }
    }
    
    ballMove = () => {
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
    
    // computerMove() {
    //     this._game.computer.y += this._game.ball.speed.y * 0.85;
    // }

    stop = () => {
        cancelAnimationFrame(this.ANIMATION.id );
    
        this.setToCenter;
    
        this._game.ball.speed.y = 2;
    
        this._game.computer.score = 0;
        this._game.computer.player = 0;
    
        this._computer_score.textContent = this._game.computer.score;
        this._player_score.textContent = this._game.player.score;
    
        this.draw();
    }
  }