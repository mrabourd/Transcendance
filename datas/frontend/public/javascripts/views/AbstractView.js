export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
    async setUser(user) {
        this._user = user;
    }
    
    addEvents () {

    }
}