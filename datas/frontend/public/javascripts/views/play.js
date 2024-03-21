import AbstractView from "./AbstractView.js";

let canvas;
let game;
let anim;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play fun");
    }

    async getHtml(DOM) {
        await fetch('/template/play').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }


    addEvents () {
        canvas = document.getElementById('canvas');
        game = {
            player: {
                y: canvas.height / 2 - PLAYER_HEIGHT / 2,
                score: 0
            },
            computer: {
                y: canvas.height / 2 - PLAYER_HEIGHT / 2,
                score: 0
            },
            ball: {
                x: canvas.width / 2,
                y: canvas.height / 2,
                r: 5,
                speed: {
                    x: 2,
                    y: 2
                }
            }
        }
        this.draw();
        // play();
        document.querySelector('#start-game').addEventListener('click',  this.play());
        document.querySelector('#stop-game').addEventListener('click',  this.stop());
        // canvas.addEventListener('mousemove', playerMove);
        document.addEventListener('keydown', this.playerMoveKey());
    }


    draw() {
        let context = canvas.getContext('2d');
    
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();
    
        context.fillStyle = 'white';
        context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        context.fillRect(canvas.width - PLAYER_WIDTH,
            game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    
        context.beginPath();
        context.fillStyle = 'white';
    
        context.arc(game.ball.x,
        game.ball.y, game.ball.r, 0, Math.PI * 2, false);
        context.fill();
    }
    
    setToCenter(){
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
        game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    
        game.ball.speed.x = 2;
    }
    
    collide(player) {
        if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
            this.setToCenter();
            if (player == game.player) {
                game.computer.score++;
                document.querySelector('#computer-score').textContent = game.computer.score;
            }
            else {
                game.player.score++;
                document.querySelector('#player-score').textContent = game.player.score;
            }
        }
        else {
            game.ball.speed.x *= -1.2;
            this.ChangeDirection(player.y);
        }
    
    }
    
    ChangeDirection (playerPosition) {
        let impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
        let ratio = 100 / (PLAYER_HEIGHT / 2);
    
        // Math.round = return the value of a nb rounded to the nearest int
        game.ball.speed.y = Math.round(impact * ratio / 10);
    }
    
    
    playerMoveKey(event) {
        if (event)
        {
        if (event.key === "ArrowDown"){
            if (game.player.y + PLAYER_HEIGHT > canvas.height)
                game.player.y = canvas.height - PLAYER_HEIGHT;
            game.player.y += 25;
        }
        else if (event.key === "ArrowUp"){
            if(game.player.y < PLAYER_HEIGHT / 2)
                game.player.y = 0;
            game.player.y -= 25;
        }
    }
    }
    
    ballMove() {
        if (game.ball.y > canvas.height || game.ball.y < 0) {
            game.ball.speed.y *= -1;
        }
    
        if (game.ball.x > canvas.width - PLAYER_WIDTH) {
            this.collide(game.computer);
        }
        else if (game.ball.x < PLAYER_WIDTH) {
            this.collide(game.player);
        }
    
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
    }
    
    computerMove() {
        game.computer.y += game.ball.speed.y * 0.85;
    }
    
    play() {
        console.log("play")
        this.draw;
    
        this.computerMove;
        this.ballMove;
    
        anim = requestAnimationFrame(this.play());
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion
    stop() {
        cancelAnimationFrame(anim);
    
        this.setToCenter;
    
        game.ball.speed.y = 2;
    
        game.computer.score = 0;
        game.computer.player = 0;
    
        document.querySelector('#computer-score').textContent = game.computer.score;
        document.querySelector('#player-score').textContent = game.player.score;
    
        this.draw();
    }

}