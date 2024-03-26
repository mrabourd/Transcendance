export default class User {
    constructor() {
        console.log("User constructor called")
        this._isConnected = false;
        this._view = null;
        this._datas = null;
    }
    set isConnected(n)
    {
        this._isConnected = n;
    }
    get isConnected()
    {
        return this._isConnected;
    }
    set view(n)
    {
        this._view = n;
    }
    get view()
    {
        return this._view;
    }
    set datas(n)
    {
        this._datas = n;
    }
    get datas()
    {
        return this._datas;
    }
    checkLocalStorage = async() => {
        console.log("checkLocalStorage")
        /*
        const reponse = await fetch("http://localhost:3000/user.json")
        const JsonUser = await reponse.json();
        const strJsonUser = JSON.stringify(JsonUser);
        window.localStorage.setItem("LocalUser", strJsonUser);
        */
        let LocalUser = window.localStorage.getItem("LocalUser");
        if (LocalUser !== null)
        {
            this.datas = JSON.parse(LocalUser);
            this._isConnected = true;
            /*
            TODO
            Renvoyer le token au back et checker si le token correspond
            */
        }
        else
        {
            this._isConnected = false;
        }
    }
  }