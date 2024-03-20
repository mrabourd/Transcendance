import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Play fun");
    }

    async getHtml() {
        console.log("coucouo");


        fetch('/template/play').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            //const parser = new DOMParser();
            //const jsdom = require("jsdom");
            const dom = new JSDOM(html);
//            const doc = parser.parseFromString(html, "text/html");
           return(dom);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }
}