import AbstractView from "./AbstractView.js";

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
        console.log("Add Event Tournament")
        document.getElementById('tournament').addEventListener('click', async (event) =>  {
            event.preventDefault();
            this.createTournament();
        })
    }

    createTournament = async () => { 
        console.log("now you can create tournament")
        document.getElementById("createTournament").classList.remove("d-none")
    }
}