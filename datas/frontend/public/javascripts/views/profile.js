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
        document.querySelector("#username span").innerText = this.user.datas.username;
        document.querySelector("#firstname span").innerText = this.user.datas.firstname;
        document.querySelector("#lastname span").innerText = this.user.datas.lastname;
        document.querySelector("#age span").innerText = this.user.datas.age;
        document.querySelector("#email span").innerText = this.user.datas.email;
        document.querySelector("#token span").innerText = this.user.datas.token;
    }

    addEvents () {
        console.log("fillHtml")
    }
}