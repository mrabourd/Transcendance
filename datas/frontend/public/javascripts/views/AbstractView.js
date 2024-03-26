export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
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
}