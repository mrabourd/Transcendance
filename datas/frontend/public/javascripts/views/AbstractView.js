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
    printHeader()
    {
        if (this.user.isConnected)
        {
            console.log("isConnected")
            document.querySelector("nav div div").innerHTML = 
            `<ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item active">
              <a class="nav-link" aria-current="page" href="/home" data-link>Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/" data-link>Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/play" data-link>Play</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contact" data-link>Contact</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/profile" data-link>Profile</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/websocket" data-link>websocket</a>
            </li>
          </ul>`;
        }
        else
            console.log("login")
    }
    addEvents () {

    }
}