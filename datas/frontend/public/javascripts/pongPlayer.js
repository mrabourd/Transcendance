import AbstractPong from "./AbstractPong.js";

export default class extends AbstractPong {
    constructor(params) {
        super(params);
    }


    computerMove() {
        this._game.computer.y += this._game.ball.speed.y * 0.01;
    }

    
}