import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("home");
    }


    async getHtml(DOM) {
        await fetch('/template/home').then(function (response) {
            return response.text();
        }).then(function (html) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }
    async fillHtml(DOM) {
        //console.log("fillHtml")
    }
    addEvents () {
        //console.log("Add Events")
    }
    // fonction specifiques a la vue
}