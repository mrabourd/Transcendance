import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
    }


    async getHtml(DOM) {
        await fetch('/template/profile').then(function (response) {
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
    async fillHtml(DOM) {
        console.log("fillHtml")
        document.querySelector("#id span").innerText = this.user.datas.id;
        document.querySelector("#avatar span").innerText = this.user.datas.avatar;
        document.querySelector("#first_name span").innerText = this.user.datas.first_name;
        document.querySelector("#last_name span").innerText = this.user.datas.last_name;
        // document.querySelector("#realname span").innerText = this.user.datas.realname;
        document.querySelector("#email span").innerText = this.user.datas.email;
        document.querySelector("#password span").innerText = this.user.datas.password;
        document.querySelector("#biography span").innerText = this.user.datas.biography;
        document.querySelector("#refresh span").innerText = this.user.datas.refresh;
        document.querySelector("#access span").innerText = this.user.datas.access;
        
    }

    addEvents () {
        console.log("fillHtml")
    }
}