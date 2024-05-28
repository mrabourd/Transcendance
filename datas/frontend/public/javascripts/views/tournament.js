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
    }

    addEvents () {
        document.querySelector('#app p.lead span.btn-create-tournament').addEventListener('click', async (event) =>  {
            event.preventDefault();
            this.createMatchmaking();
        })
    }

    createTournament = async () => {
        let errDiv = document.querySelector("#errorFeedback");
        
        let nametournament = document.querySelector('#app input#name-tournament').value;
        if (nametournament == ""){
            errDiv.classList.remove("d-none")
            errDiv.innerHTML = 'An error occured ! Please check fields below ...';
        }
        else
            errDiv.classList.add("d-none");
            
        console.log("name of the tournament: ", nametournament);
        // checker que les champs sont bien remplis

        let action = "create";
        let response = await this.user.request.post(`/api/match/tournament/${action}/${nametournament}/`)
        if (response.status == 200)
        {
            let JSONresponse = await response.json();
            router.navigateTo('/play/online/' + JSONresponse.tournament_name, this.user);
        }
    }

    createMatchmaking = () => { 
        document.getElementById("createTournament").classList.remove("d-none")
        document.querySelector('#app input#player1').value = this.user.datas.username;
        document.querySelector('#app div.col-12 button#matchmaking').addEventListener('click', async (event) =>  {
            event.preventDefault();
            this.createTournament();
        })
        
    }
}