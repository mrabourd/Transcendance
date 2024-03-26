import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Contact");
    }
    async getHtml(DOM) {
        await fetch('/template/contact').then(function (response) {
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
    }
    addEvents () {
        console.log("Add Events")
    }
}