export default class Request {
    constructor() {
        console.log("Request constructor called")
        this._token = null;
    }

    set token(n)
    {
        this._token = n;
    }

    get token()
    {
        return this._token;
    }



    async post(RQ_url, RQ_body) {
        
        let CSRF = this.getCsrfToken();
        console.log("CSRF : ", CSRF)
        RQ_body.csrfmiddlewaretoken = CSRF;
        RQ_body.csrf_token = CSRF;
        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://127.0.0.1:8483/',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF
                },
                body: JSON.stringify(RQ_body)
            });
            return response;
        } catch (error) {
            console.error('REQUEST POST / ERROR (49) :', error);
            throw error;
        }
    }



    async get(RQ_url) {
        console.log("Request GET() ", RQ_url);
        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://127.0.0.1:8483',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token.access}`,
                }
            });
            if (response.status == 401)
            {
                let RefreshResponse = await this.refreshToken();
                if (RefreshResponse.ok)
                    return await this.get(RQ_url);
                else
                    return response;
            }
            else
                return response;
        } catch (error) {
            console.error('REQUEST GET / ERROR (49) :', error);
            throw error;
        }
    }

    async refreshToken()
    {
        let response = await this.post('/login/refresh/', this.token);
        return response;
    }

    rmLocalToken()
    {
        window.localStorage.removeItem("LocalToken");
        this.token = null;
    }
    getLocalToken()
    {
        console.log("getLocalToken");
        let tmp = window.localStorage.getItem("LocalToken");
        this.token = JSON.parse(tmp);
        // TODO recuperer un cookie pour plus de securite
        return this.token;
    }

    setLocalToken(tk_access, tk_refresh)
    {
        this.token = 
        {
            access: tk_access,
            refresh: tk_refresh,
        }
        window.localStorage.setItem("LocalToken", JSON.stringify(this.token));
    }

    async checkLocalToken()
    {
        this.getLocalToken();
        let response = await this.get("/api/users/all/")
        if (response.ok)
            return true;
        else
        {
            return false;
        }
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

    getCsrfToken() {
        const csrfCookie = document.cookie.split('; ')
            .find(cookie => cookie.startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    }
    

}


/*
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
                    'Accept': 'application/json, text/plain,
                    'Origin': 'http://127.0.0.1:8080',
                    'Authorization': `Token ${token}`
                }
            });
            if (response.ok) {
                return true;

        } catch (error) {
            console.error('user.verifyToken : There was a problem :', error);
            throw error;
        }
    }


*/