import * as header from "../header.js";
import * as aside from "../aside.js";

export default class {
    constructor(params) {
        this.params = params;
        this.chatSocket = null
        this.PongSocket = null
    }

    async setTitle(title) {
        document.title = title;
    }

    set user(u) {
        this._user = u;
    }
    get user() {
        return this._user;
    }

    async getHtml() {
        return "";
    }
    async fillHtml() {
        return "";
    }

    addEvents () {

    }


    printHeader()
    {
        header.print(this.user);
    }
    async printAside()
    {
        await aside.print(this.user);
    }
}

/*
        { id:0, path: "/", view: login },
        { id:1, path: "/login", view: login },
        { id:2, path: "/register", view: register },
        { id:3, path: "/home", view: home },
        { id:4, path: "/profile", view: profile },
        { id:5, path: "/profile/:id", view: profile },
        { id:6, path: "/tournament", view: tournament },
        { id:7, path: "/contact", view: contact },
        { id:7, path: "/websocket", view: websocket },
        { id:8, path: "/play", view: play }
*/