export default class Request {
    constructor() {
        console.log("Request constructor called")
        this._JWTtoken = null;
    }

    set JWTtoken(n)
    {
        this._JWTtoken = n;
    }

    get JWTtoken()
    {
        return this._JWTtoken;
    }

    async post(RQ_url, RQ_body) {
        /// REQUEST HEADERS
        if (!RQ_body)
            RQ_body = {}
        let request_headers = 
        {
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://127.0.0.1:8483/',
            'Content-Type': 'application/json',
        }
        let csrftoken = await this.getCsrfToken()
        if (csrftoken)
        {
            request_headers['X-CSRFToken'] = csrftoken
            RQ_body.csrfmiddlewaretoken = csrftoken
        }
        if (this.JWTtoken)
            request_headers['Authorization'] = `Bearer ${this.JWTtoken.access}`


        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'POST',
                headers: request_headers,
                body: JSON.stringify(RQ_body),
                credentials: 'include'
            });
            if (response.headers.has('X-CSRFToken'))
                this.setCsrfToken(response.headers.get('X-CSRFToken'))
 
            if (response.status == 401 && RQ_url != '/api/users/login/refresh/')
            {
                let RefreshResponse = await this.refreshJWTtoken();
                if (RefreshResponse.ok)
                    return await this.post(RQ_url);
                else
                    return response;
            }
            else
                return response;
        } catch (error) {
            console.error('POST ERROR :', error);
            throw error;
        }
    }

    async put(RQ_url, RQ_body) {

        /// REQUEST HEADERS
        if (!RQ_body)
            RQ_body = {}
        let request_headers = 
        {
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://127.0.0.1:8483/',
            'Content-Type': 'application/json',
            credentials: 'include'

        }
        let csrftoken = await this.getCsrfToken()
        if (csrftoken)
        {
            request_headers['X-CSRFToken'] = csrftoken
            RQ_body.csrfmiddlewaretoken = csrftoken
        }
        if (this.JWTtoken)
            request_headers['Authorization'] = `Bearer ${this.JWTtoken.access}`


        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'PUT',
                headers: request_headers,
                body: JSON.stringify(RQ_body)
            });
            if (response.status == 401)
            {
                let RefreshResponse = await this.refreshJWTtoken();
                if (RefreshResponse.ok)
                    return await this.put(RQ_url);
                else
                    return response;
            }
            else
                return response;
        } catch (error) {
            console.error('REQUEST PUT / ERROR (72) :', error);
            throw error;
        }
    }

    async get(RQ_url) {

        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://127.0.0.1:8483',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.JWTtoken ? this.JWTtoken.access : null}`,
                }
            });
            if (response.status == 401)
            {
                let RefreshResponse = await this.refreshJWTtoken();
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

    async refreshJWTtoken()
    {
        let response = await this.post('/api/users/login/refresh/', this.JWTtoken);
		if (response.ok)
		{
			let jsonData = await response.json();
			this.JWTtoken = jsonData;
			this.setJWTtoken(jsonData.access, jsonData.refresh);
		}
        else
            this.rmJWTtoken()
        return response;
    }

    rmJWTtoken()
    {
        window.localStorage.removeItem("JWTtoken");
        this.token = null;
    }
    getJWTtoken()
    {
        let tmp = window.localStorage.getItem("JWTtoken");
        this.token = JSON.parse(tmp);
        // TODO recuperer un cookie pour plus de securite
        return this.token;
    }

    setJWTtoken(tk_access, tk_refresh)
    {
        this.JWTtoken =
        {
            access: tk_access,
            refresh: tk_refresh,
        }
        window.localStorage.setItem("JWTtoken", JSON.stringify(this.token));
    }

    async checkJWTtoken()
    {
        this.getJWTtoken();
        let response = await this.get("/api/users/all/")
        if (response.ok)
            return true;
        else
            return false;
    }

    getCookie = (name) =>
    {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    async getCsrfToken() {
        const csrfCookie = this.getCookie('csrftoken')
        if (csrfCookie)
        {
            return csrfCookie
        }
        return null;
    }

    async setCsrfToken(csrftoken)
    {
        this.setCookie('csrftoken', csrftoken, 1)
    }


}
