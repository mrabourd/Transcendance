export default class User {
    constructor() {
        console.log("User constructor called")
        this._name = "toto";


    }

    set username(n)
    {
        this._username = n;
    }

    set view(n)
    {
        this._view = n;
    }

    get username()
    {
        return this._username;
    }

    get view()
    {
        return this._view;
    }
    set infos(n)
    {
        this._infos = n;
    }

    get infos()
    {
        return this._infos;
    }

    async isConnected() {
        console.log("isConnected")
        const reponse = await fetch("http://localhost:3000/user.json")
        const JsonUser = await reponse.json();
        const strJsonUser = JSON.stringify(JsonUser);
        window.localStorage.setItem("LocalUser", strJsonUser);

        const LocalUser = window.localStorage.getItem("LocalUser");
        if (LocalUser !== null)
        {
            infos = JSON.parse(LocalUser);
            console.log(infos.email)
            //this.isConnected = true;
        }
        else
        {
            console.log("null")
        }
        //else
            //this.isConnected = false;
        //return this.isConnected;

    }
  }