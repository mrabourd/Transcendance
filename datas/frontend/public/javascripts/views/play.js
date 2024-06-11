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

	click_redirection_bt = async (e) => {
		e.preventDefault();
		const link = e.currentTarget.getAttribute('data-link-play');
		if (link == 'create_match')
			{
				let response = await this.user.request.get("/api/match/create/")
				if (response.ok)
				{
					let JSONResponse = await response.json();
					this.user.router.navigateTo('/play/' + JSONResponse.match_id, this.user)
				}
			}
			else
			{
				this.user.router.navigateTo(link, this.user);
			}
	}

	addEvents () {
		let button = document.querySelector('#app button.redirection')
		button.removeEventListener('click', this.click_redirection_bt);
		button.addEventListener('click', this.click_redirection_bt);

		if (this.params.match_id)
		{
			document.querySelector('#app p.play_info').innerHTML = "Play with arrows "
			let canvas = document.getElementById('canvas');
			canvas.classList.remove('d-none')
			this.pong = new pongOnline(canvas, this.user, this.match_id);
			this.pong.connect();
			this.PongSocket = this.pong.PongSocket
			
			document.addEventListener("keydown", (event) => {
				if (!this.pong.currentKeysDown.includes(event.key)) {
					this.pong.currentKeysDown.push(event.key);
				}
				this.pong.movePaddles();
			})
			document.addEventListener("keyup", (event) => {
				this.pong.currentKeysDown.splice(this.pong.currentKeysDown.indexOf(event.key), 1)
				this.pong.movePaddles();
			})
		}
		else
		{
			button.textContent = "Play locally with a friend"
			button.setAttribute('data-link-play', 'create_match');
			button.classList.remove("d-none")
		}



    }
}