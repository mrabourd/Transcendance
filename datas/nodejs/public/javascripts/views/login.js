import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login too Transcendance");
    }

    async getHtml() {
        return `
            <h1>Login</h1>
        `;
    }
}