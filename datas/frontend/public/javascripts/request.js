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

        let CSRF = await this.getCsrfToken();
        console.log("CSRF : ", CSRF)
        if (CSRF)
        {
            RQ_body.csrfmiddlewaretoken = CSRF;
            RQ_body.csrf_token = CSRF;
        }

        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://127.0.0.1:8483/',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF,
                    'Authorization': `Bearer ${this.token ? this.token.access : null}`,
                },
                body: JSON.stringify(RQ_body)
            });
            if (response.status == 401 && RQ_url != '/api/users/login/refresh/')
            {
                let RefreshResponse = await this.refreshToken();
                if (RefreshResponse.ok)
                    return await this.get(RQ_url);
                else
                    return response;
            }
            else
                return response;        } catch (error) {
            console.error('REQUEST POST / ERROR (49) :', error);
            throw error;
        }
    }

    async put(RQ_url, RQ_body) {

        let CSRF = await this.getCsrfToken();
        console.log("CSRF : ", CSRF)
        if (CSRF)
        {
            RQ_body.csrfmiddlewaretoken = CSRF;
            RQ_body.csrf_token = CSRF;
        }

        try {
            const response = await fetch('https://127.0.0.1:8443' + RQ_url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://127.0.0.1:8483/',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF,
                    'Authorization': `Bearer ${this.token ? this.token.access : null}`,
                },
                body: JSON.stringify(RQ_body)
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
                return response;        } catch (error) {
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
                    'Authorization': `Bearer ${this.token ? this.token.access : null}`,
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
        let response = await this.post('/api/users/login/refresh/', this.token);
		if (response.ok)
		{
			let jsonData = await response.json();
			this.token = jsonData;
			this.setLocalToken(jsonData.access, jsonData.refresh);
		}
        else
            this.rmLocalToken()
        return response;
    }

    rmLocalToken()
    {
        window.localStorage.removeItem("LocalToken");
        this.token = null;
    }
    getLocalToken()
    {
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
        const csrfCookie = document.cookie.split('; ')
            .find(cookie => cookie.startsWith('csrftoken='));
        if (csrfCookie)
        {
            return csrfCookie.split('=')[1]
        }
        else
        {
            let response = await this.get("/api/users/get_csrf_token/")
            const jsonData = await response.json();
            console.log('get_csrf_token', jsonData.csrf_token)
            this.setCookie('csrftoken', jsonData.csrf_token, 1)
            return jsonData.csrf_token;

        }
        return null;
    }


}
