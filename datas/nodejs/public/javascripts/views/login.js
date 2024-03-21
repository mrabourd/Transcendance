import AbstractView from "./AbstractView.js";
import login from "../login.js";
import login42 from "../login42.js";
import * as Reg from '../register.js'
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login too Transcendance");
    }

    async getHtml(DOM) {
        await fetch('/template/login').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
            let loginButton = DOM.querySelector('#loginButton');
            DOM.querySelector('#loginButton').addEventListener("click", login);
            DOM.querySelector('#login42Button').addEventListener("click", login42);
            DOM.querySelector('#registerButton').addEventListener("click", Reg.register);

            document.getElementById("form3Example3c").oninput = function (){Reg.checkEmail ()};
            document.getElementById("form3Example4cd").oninput = function () {Reg.checkPasswords ()}; 

        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }


}