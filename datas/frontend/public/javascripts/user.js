export default class User {
    constructor() {

        console.log("USer constructor called")
        this.isConnected = false;
        this._name = "toto";
    }

    set username(n)
    {
        this._username = n;
    }

    get username()
    {
        return this._username;
    }

    isConnected = () => {
        return this.isConnected;
    }
  }