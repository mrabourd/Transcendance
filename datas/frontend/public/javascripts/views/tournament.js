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
        document.querySelector('#app table.table').classList.add("d-none");

    }

    async addEvents () {
        if (this.params.tournament_id)
        {
            let response = await this.user.request.get(`/api/match/tournament/${this.params.tournament_id}/`)
            if(response.ok)
            {
                let tr
                let td
                let link
                let id_match = 0
                document.querySelector('#app table.table').classList.remove("d-none");
                document.querySelector('#app #createTournament').remove();

                let JSONResponse = await response.json()
                document.querySelector('#app h1.tournament_name').innerHTML = JSONResponse[0]['name']
                document.querySelector('#app p.tournament_info').innerHTML = JSONResponse[0]['status']
                JSONResponse[0]["matches"].forEach(match => {
                    id_match++;

                    tr = document.createElement("tr")
                    td = document.createElement("td")
                    td.innerHTML = id_match
                    tr.appendChild(td)

                    match["match_points"].forEach(player => {
                        td = document.createElement("td")
                        td.innerHTML = player["alias"]
                        tr.appendChild(td)
                    })
                    td = document.createElement("td")
                    link = document.createElement("a")
                    link.classList.add("mr-2", "btn", "btn-primary", "btn-lg")
                    link.innerHTML = "Play Match " + id_match
                    link.addEventListener('click',  async e => {
                        e.preventDefault();
                        this.user.router.navigateTo(`/play/online/${match["match_id"]}`, this.user)
                    })
                    td.appendChild(link)
                    tr.appendChild(td)
                    document.querySelector('#app tbody.matchs').appendChild(tr)
                })
                console.log(JSONResponse);

            }
        }
        else
        {
            this.enterNames();
        }
        
    }

    displayPlayers = async (picks) => {
		// let tournament_name = JSONresponse.name;

        document.querySelector('#app table.table').classList.remove("d-none");

        document.querySelector('#app td.player1-match').innerHTML = picks[0][0];
        document.querySelector('#app td.player2-match').innerHTML = picks[1][0];
        document.querySelector('#app td.player3-match').innerHTML = picks[2][0];
        document.querySelector('#app td.player4-match').innerHTML = picks[3][0];

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
                let random = Math.floor(Math.random() * 4);
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
        // p1.classList.add("readonly")
		let p2 = document.querySelector('#app input#player2').value;
		let p3 = document.querySelector('#app input#player3').value;
		let p4 = document.querySelector('#app input#player4').value;
		let players = [["username", p1, p1], ["alias", p2, p2], ["alias", p3, p3], ["alias", p4, p4]];
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
            console.log("user: ", this.user);
			document.querySelector('#app #match1-button').addEventListener('click', async (event) =>  {
				event.preventDefault();
				router.navigateTo('/play/online/' + JSONresponse.match1, this.user);
			})
            document.querySelector('#app #match2-button').addEventListener('click', async (event) =>  {
				event.preventDefault();
				router.navigateTo('/play/online/' + JSONresponse.match2, this.user);
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