export default class User {
    constructor() {
        console.log("User constructor called")
        this._isConnected = false;
        this._view = null;
        this._datas = {username:"john"};
        this._token = null;
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
    set token(n)
    {
        this._token = n;
    }
    get token()
    {
        return this._token;
    }
    set datas(n)
    {
        this._datas = n;
    }
    get datas()
    {
        return this._datas;
    }

    async login(userName, passWord) {
        console.log("user login()")
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: userName, password: passWord})
            });
            console.log("user login()", "response",response)
            if (response.ok)
            {
                const jsonData = await response.json();
                this.saveLocalToken(jsonData)
                this.isConnected = true;
                return true;
            } else if (response.status === 401) {
                const jsonData = await response.json();
                return jsonData.detail;
            }
        } catch (error) {
            console.error('user.js (88) There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    checkLocalStorage = async() => {
        console.log("checkLocalStorage")
        let token = this.getLocalToken();
        if (token !== null)
        {
            let response = await this.verifyToken(token);
            if (response == true)
            {
                this.token = token
                this._isConnected = true;
            }
            else
            {
                this.token = null;
                this._isConnected = false;
            }
        }
        else
        {
            this._isConnected = false;
        }
        return this._isConnected;
    }
    getLocalToken = () =>
    {
        console.log("getLocalToken");
        let token = window.localStorage.getItem("LocalToken");
        // TODO recuperer un cookie pour plus de securite
        return JSON.parse(token)
    }

    saveLocalToken = (jsonData) =>
    {
        console.log("saveLocalToken");
        window.localStorage.setItem("LocalToken", JSON.stringify(jsonData));
        this.token = jsonData;
        // TODO enregistrer un cookie pour plus de securite
        return window.localStorage.getItem("LocalToken");
    }

    verifyToken = async(token) =>{
        console.log("verifyToken")
        // TODO : WAIT FOR DJANGO CHECK TOKEN API
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête Authorization
                }
            });
            if (response.ok) {
                //console.log("Token is valid");
                return true;
            } else {
                //console.log("Token is invalid");
                return true; // pass to false
            }
        } catch (error) {
            console.error('user.verifyToken : There was a problem :', error);
            throw error;
        }
    }

    logout = async() =>{
        token = this.getLocalToken()
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/logout/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête Authorization
                }
            });
            if (response.ok) {
                return true;
            }
        } catch (error) {
            console.error('user.logout : There was a problem :', error);
            throw error;
        }
    }
}