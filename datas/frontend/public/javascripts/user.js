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
            this.verifyToken(this.datas)
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
    async login(userName, passWord) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: userName, password: passWord})
            });

            if (response.ok)
            {
                const jsonData = await response.json();
                window.localStorage.setItem("LocalUser", JSON.stringify(jsonData));
                this.datas = jsonData;
                this.isConnected = true;
                return true;
            } else if (response.status === 401) {
                const jsonData = await response.json();
                return jsonData.detail;
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }



    async verifyToken(token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify/token/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête Authorization
                }
            });

            if (response.ok) {
                console.log("Token is valid");
                return true;
            } else {
                console.log("Token is invalid");
                return false;
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}
/*
const tokenData = {
    refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxMjM0OTg3MywiaWF0IjoxNzExMDUzODczLCJqdGkiOiIyYmQyYzVhOTBkNjc0ODg5OTIwYzZmNDFjZmJhYTBjZiIsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZ2xhIiwiZW1haWwiOiJnbGFAZ2xvdS5jb20ifQ.vYlYzmyvC9Gk-XgcAO3623Qa2YXldVvAKxaG4jYAZ1Y",
    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzExMDU0MTczLCJpYXQiOjE3MTEwNTM4NzMsImp0aSI6IjhlMThiMzk3MTgxMDQ1YTA4Y2RkNzYzODI5NTk3YjA1IiwidXNlcl9pZCI6MiwidXNlcm5hbWUiOiJnbGEiLCJlbWFpbCI6ImdsYUBnbG91LmNvbSJ9.UKOY4Xb1xrW2W5bqhcB1Fz6benfMjqXQYNuxgROtIBg"
};
// Convertir les données en format JSON
const tokenDataJSON = JSON.stringify(tokenData);

// Stocker les données dans le stockage local
localStorage.setItem('tokens', tokenDataJSON);

// Pour récupérer les données ultérieurement :
const storedTokenDataJSON = localStorage.getItem('tokens');
const storedTokenData = JSON.parse(storedTokenDataJSON);

// Maintenant vous pouvez utiliser storedTokenData.refresh et storedTokenData.access comme nécessaire dans vos appels d'API.
*/