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
            document.querySelector('#app table.table').classList.add("d-none");
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }

    async addEvents () {
        if (this.params.tournament_id)
            this.display_tournament_infos(this.params.tournament_id)
        else
            this.display_tournament_form();        
    }

    async display_tournament_infos(id_tournament){
        let response = await this.user.request.get(`/api/match/tournament/${this.params.tournament_id}/`)
        if(response.ok)
        {
            let tr
            let td
            let link
            let id_match = 0
            let id_player = 0
            document.querySelector('#app table.tournament_matchs').classList.remove("d-none");
            // document.querySelector('#app form.create_tournament').remove("d-none")
            let JSONResponse = await response.json()
            console.log("response match: ", JSONResponse);
            document.querySelector('#app h1.tournament_name').innerHTML = JSONResponse[0]['name']
            document.querySelector('#app p.tournament_info').innerHTML = JSONResponse[0]['status']
            this.setTitle(JSONResponse[0]['name']);
            JSONResponse[0]["matches"].forEach(match => {
                id_match++;
                tr = document.createElement("tr")
                td = document.createElement("td")
                td.innerHTML = id_match
                tr.appendChild(td)
                id_player = 0
                match["match_points"].forEach(player => {
                    td = document.createElement("td")
                    td.classList.add("player_" + id_player)
                    td.innerHTML = `${player["alias"]} [${player["points"]}]`
                    tr.appendChild(td)
                    id_player++;
                })

                td = document.createElement("td")
                if (match["status"] == 2) // ended
                {
                    if (match["match_points"][0]["points"] > match["match_points"][1]["points"])
                    {
                        tr.querySelector(".player_0").classList.add("text-success")
                        tr.querySelector(".player_1").classList.add("text-danger")
                    }
                    else
                    {
                        tr.querySelector(".player_1").classList.add("text-success")
                        tr.querySelector(".player_0").classList.add("text-danger")

                    }
                    td.innerHTML = 'ended'
                }
                else
                {
                    link = document.createElement("a")
                    link.classList.add("mr-2", "btn", "btn-primary", "btn-lg")
                    link.innerHTML = "Play Match " + id_match
                    link.addEventListener('click',  async e => {
                        e.preventDefault();
                        this.user.router.navigateTo(`/play/${match["match_id"]}`, this.user)
                    })
                    td.appendChild(link)
                } 
                tr.appendChild(td)
                document.querySelector('#app tbody.matchs').appendChild(tr)
           
           
            })
        }
    }

    display_tournament_form = () => { 
        document.querySelector("#app form.create_tournament").classList.remove("d-none")
        document.querySelector('#app input#player1').value = this.user.datas.username;
        document.querySelector('#app div.col-12 button#matchmaking').addEventListener('click', async (event) =>  {
            event.preventDefault();
            this.createTournament();
        })
        
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

    createTournament = async () => {
        let errDiv = document.querySelector("#errorFeedback");
        
        let nametournament = document.querySelector('#app input#name-tournament').value;
        let p1 = document.querySelector('#app input#player1').value;
		let p2 = document.querySelector('#app input#player2').value;
		let p3 = document.querySelector('#app input#player3').value;
		let p4 = document.querySelector('#app input#player4').value;
        if (nametournament == "" || p1 == "" || p2 == "" || p3 == "" || p4 == ""){
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
		
		let players = [["username", p1, p1], ["alias", p2, p2], ["alias", p3, p3], ["alias", p4, p4]];
		picks = await this.matchmaking(players);
		let RQ_BODY = {
			'name': nametournament,
			'players': picks
		}
        let response = await this.user.request.post(`/api/match/tournament/${action}/`, RQ_BODY)
        if (response.status == 200){
			let tournament_id = await response.json();
            this.user.router.navigateTo(`/tournament/${tournament_id}`, this.user)
        }
    }


}