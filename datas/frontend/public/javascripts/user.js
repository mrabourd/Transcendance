import * as header from "./header.js";

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

    getCookie = (name) =>
    {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    async login(userName, passWord) {
        console.log("user login()")
        try {
            const response = await fetch('https://127.0.0.1:8443/api/users/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'http://127.0.0.1:8080',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: userName, password: passWord})
            });
            console.log("user login()", "response",response)
            if (response.ok)
            {
                const jsonData = await response.json();
                console.log("jsonData:", jsonData);
                this.saveLocalToken(jsonData)
                this.isConnected = true;
                // todo >> recuperer les datas.
                this.datas.username = jsonData.user.username;
                this.datas.first_name = jsonData.user.first_name;
                this.datas.last_name = jsonData.user.last_name;
                this.datas.email = jsonData.user.email;
                this.datas.id = jsonData.user.id;
                console.log("datas:", this._datas);
                header.printHeader(this);
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
        console.log("checkLocalStorage");
        let token = this.getLocalToken();
        console.log("token blablablablba: ", token);
        if (token !== null)
        {
            let response = await this.verifyToken(token);
            if (response == true)
            {
                this.datas = token;
                this._isConnected = true;
                this.datas.isConnected = "yes";
                this.datas.username = token.user.username;
                this.datas.first_name = token.user.first_name;
                this.datas.last_name = token.user.last_name;
                this.datas.email = token.user.email;
                this.datas.id = token.user.id;
            }
            else
            {
                this.token = null;
                this._isConnected = false;
                this.datas.isConnected = "no";
            }
        }
        else
        {
            this._isConnected = false;
            this.datas.isConnected = "no";
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
    deleteLocalToken = () =>
    {
        console.log("deleteLocalToken");
        window.localStorage.removeItem("LocalToken");
        window.localStorage.clear();
        this.token = null;
        return ;
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
            const response = await fetch('https://127.0.0.1:8443/api/users/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Origin': 'http://127.0.0.1:8080',
                    'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête Authorization
                }
            });
           // if (response.ok) {
                return true;
          //  } else {
           //     return true; // pass to false
//}
        } catch (error) {
            console.error('user.verifyToken : There was a problem :', error);
            throw error;
        }
    }
    logout = async() =>{

        let token = this.getLocalToken()
        const csrftoken = this.getCookie('csrftoken');
        console.log(csrftoken);
        try {
            const response = await fetch('https://127.0.0.1:8443/api/users/logout/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'text/plain',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token ${token.access}` // Envoyer le token dans l'en-tête Authorization
                },
                body: "bye"
            });
           // if (response.ok) {
                this.deleteLocalToken();
                this.isConnected = false;
                header.printHeader(this);
           // }

        } catch (error) {
            console.error('user.logout : There was a problem :', error);
            throw error;
        }
    }
}