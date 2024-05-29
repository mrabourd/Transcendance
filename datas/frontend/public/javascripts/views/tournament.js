import AbstractView from "./AbstractView.js";
import * as utils from "../utils_form.js";
import * as router from "../router.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
    }

    async getHtml(DOM) {
        await fetch('/template/tournament').then(function (response) {
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
        document.getElementById("createTournament").classList.add("d-none");
        document.querySelector('#app table.table').classList.add("d-none");
    }

    addEvents () {
		document.querySelector('#app p.lead span.btn-create-tournament').addEventListener('click', async (event) =>  {
			console.log("this.user.datas.status: ", this.user.datas.status);
			event.preventDefault();
			// if (this.user.datas.status == 'online'){
				// console.log("this.user.datas.status: ", this.user.datas.status);
				this.enterNames();
			// }
			// else {
			// 	let errDiv = document.querySelector("#errorFeedback");
			// 	errDiv.classList.remove("d-none")
			// 	errDiv.innerHTML = 'You are not allowed to create a tournament due to your status!';
			// }
		})
    }

    displayPlayers = async (picks) => {
		// let tournament_name = JSONresponse.name;

        document.querySelector('#app table.table').classList.remove("d-none");

        document.querySelector('#app td.player1-match').innerHTML = picks[0];
        document.querySelector('#app td.player2-match').innerHTML = picks[1];
        document.querySelector('#app td.player3-match').innerHTML = picks[2];
        document.querySelector('#app td.player4-match').innerHTML = picks[3];

    }

    matchmaking = async (players) => {
        let errDiv = document.querySelector("#errorFeedback");
        let picks = [];

        if (players[0] == "" || players[1] == ""
            || players[2] == "" || players[3] == ""){
            errDiv.classList.remove("d-none")
            errDiv.innerHTML = 'You must fill all the inputs!';
        }

        else {
            
            let used = undefined;

            for (let x = 0; x < 2 ; x++) {
                let random = Math.floor(Math.random() * 3);
                if (players[random] == used){
                    random++;
                }
                picks.push(players[random]);
                used = players[random];
            }
            for (let i = 0; i < 4 ; i++){
                if (players[i] == picks[0] || players[i] == picks[1]){
					console.log("continue");
					continue;
				}
                else{
                    picks.push(players[i]);
				}
            }

        }

        return picks;
    }

    createTable = async () => {
        let errDiv = document.querySelector("#errorFeedback");
        
        let nametournament = document.querySelector('#app input#name-tournament').value;
        if (nametournament == ""){
            errDiv.classList.remove("d-none")
            errDiv.innerHTML = 'An error occured! Please fill all the fields...';
            return;
        }
        else
            errDiv.classList.add("d-none");
            
        console.log("name of the tournament: ", nametournament);
        // checker que les champs sont bien remplis

        let action = "create";
        let picks = [];
		let p1 = document.querySelector('#app input#player1').value;
		let p2 = document.querySelector('#app input#player2').value;
		let p3 = document.querySelector('#app input#player3').value;
		let p4 = document.querySelector('#app input#player4').value;
		let players = [[p1, "username"], [p2, "alias"], [p3, "alias"], [p4, "alias"]];
		picks = await this.matchmaking(players);
		console.log("picks: ", picks);

		let RQ_BODY = {
			'name': nametournament,
			'players': picks
		}
		
        let response = await this.user.request.post(`/api/match/tournament/${action}/`, RQ_BODY)
        if (response.status == 200)
			{
			let JSONresponse = await response.json();
			console.log("response: ", JSONresponse);
			// let users = ["username", "alias", "alias", "alias"];
			this.displayPlayers(picks);

			// choper les 2 matchs id dans JSONresponse

			document.querySelector('#app #match1-button').addEventListener('click', async (event) =>  {
				event.preventDefault();
				router.navigateTo('/play/' + JSONresponse.match1, this.user);
			})

        }
        else if (response.status == 401) {
            errDiv.classList.remove("d-none")
            errDiv.innerHTML = 'You are not allowed to create a tournament due to your status!';
            return;
        }
    }

    enterNames = () => { 
        document.getElementById("createTournament").classList.remove("d-none")
        document.querySelector('#app input#player1').value = this.user.datas.username;
        document.querySelector('#app div.col-12 button#matchmaking').addEventListener('click', async (event) =>  {
            event.preventDefault();
            this.createTable();
        })
        
    }
}