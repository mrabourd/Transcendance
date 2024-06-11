import AbstractView from "./AbstractView.js";
import pongOnline from "../pongOnline.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
		this.match_id = this.params.match_id
        this.setTitle("Play Pong");
    }

    async getHtml(DOM) {
        DOM.innerHTML = this.user.TemplatePlay.innerHTML;
    }


	addEvents () {
		if (this.params.match_id)
		{
			document.querySelector('#app p.play_info').innerHTML = "Play with arrows "
			let canvas = document.getElementById('canvas');
			canvas.classList.remove('d-none')
			
			this.pong = new pongOnline(canvas, this.user, this.match_id);
			this.pong.connect();
			this.PongSocket = this.pong.PongSocket
			window.addEventListener("keydown", this.preventDefaultKeyDown, false);
			window.addEventListener("keydown", this.keyupHandler)
			window.addEventListener("keyup", this.keydownHandler)
		}
		else
		{
			let button = document.querySelector('#app button.redirection')
			button.textContent = "Play locally with a friend"
			button.addEventListener('click',  async e => {
				e.preventDefault();
				let response = await this.user.request.get("/api/match/create/")
				if (response.ok)
				{
					let JSONResponse = await response.json();
					this.user.router.navigateTo('/play/' + JSONResponse.match_id, this.user)
				}
			})
			button.classList.remove("d-none")
		}

    }
}