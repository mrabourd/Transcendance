export default class Request {
    constructor() {
        this.url_origin = 'https://localhost:8483/'
        this.url_backend = 'https://localhost:8443/'
    }

    async get_request_header(){
        let request_headers = 
        {
            'Accept': 'application/json, text/plain, */*',
            'Origin': this.url_origin,
            'Content-Type': 'application/json',
        }
        request_headers['X-CSRFToken'] = await this.getCsrfToken()
        const JWTtoken = this.getJWTtoken()
        if (JWTtoken)
            request_headers['Authorization'] = `Bearer ${JWTtoken.access}`
        return request_headers
    }

    async post(RQ_url, RQ_body) {
        try {
            const response = await fetch( this.url_backend + RQ_url, {
                method: 'POST',
                headers: await this.get_request_header(),
                body: JSON.stringify(RQ_body),
                credentials: 'include'
            });
            //console.log("POST response ", response)

            if (response.headers.has('X-CSRFToken'))
                this.setCsrfToken(response.headers.get('X-CSRFToken'))
            if(response.headers.has('csrftoken'))
                this.setCookie('csrftoken', 'Strict', response.headers.get('csrftoken'), 1)
 
            if (response.status === 401 && RQ_url != '/api/users/login/refresh/')
            {
                let response_copy = response.clone()
                let jsonData = await response_copy.json();
                if (jsonData.code === 'token_not_valid')
                {
                    let RefreshResponse = await this.refreshJWTtoken();
                    if (RefreshResponse.ok)
                        return await this.post(RQ_url);
                }
            }
            else if (response.status == 403 && response.statusText == "Forbidden")
            {
                console.warn("############# REFRESH CSRF")
                this.rmCsrfToken()
                let RefreshResponse = await this.refreshCsrftoken();
                //if (RefreshResponse.ok)
                    //return await this.post(RQ_url);
            }
            return response;
        } catch (error) {
            console.error('request.js post error :', error);
            throw error;
        }
    }

    async put(RQ_url, RQ_body) {

       try {
            const response = await fetch(this.url_backend + RQ_url, {
                method: 'PUT',
                headers: await this.get_request_header(),
                body: JSON.stringify(RQ_body),
                credentials: 'include'
            });
            if (response.status === 401 && RQ_url != '/api/users/login/refresh/')
            {
                let jsonData = await response.json();
                if (jsonData.code === "user_not_found")
                {
                    throw "user not found"
                }

                let RefreshResponse = await this.refreshJWTtoken();
                if (RefreshResponse.ok)
                    return await this.put(RQ_url);
                else
                    return response;
            }
            else
                return response;
        } catch (error) {
            console.error('request.js put error :', error);
            throw error;
        }
    }

    // Pas besoin d'inclure le csrftoken
    async get(RQ_url) {
        try {
            const response = await fetch(this.url_backend + RQ_url, {
                method: 'GET',
                headers: await this.get_request_header(),
            });
            if (response.headers.has('X-CSRFToken'))
                this.setCsrfToken(response.headers.get('X-CSRFToken'))
 
            //console.log("GET response ", response)
            //console.log("RQ_url ", RQ_url)
            if (response.status === 401 && RQ_url != '/api/users/login/refresh/')
            {

                let jsonData = await response.json();
                if (jsonData.code === "user_not_found")
                {
                    //throw "user not found"
                }
                if (jsonData.code === 'token_not_valid')
                {
                    console.log("refreshJWTtoken() ")
                    let RefreshResponse = await this.refreshJWTtoken();
                    if (RefreshResponse.ok)
                        return await this.get(RQ_url);
                    //else
                      //  return response;
                }
            }
            else
                return response;
        } catch (error) {
            console.error('request.js get error :', error);
            throw error;
        }
    }

    async refreshJWTtoken()
    {
        let response = await this.post('/api/users/login/refresh/', this.getJWTtoken());
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

    async refreshCsrftoken()
    {
        let response = await this.get('/api/users/refresh_csrftoken/');
		if (response.ok)
		{
            console.log("response.ok")
            if (response.headers.has('X-CSRFToken'))
                {
                    console.log("set new token : ", response.headers.get('X-CSRFToken'))
                    this.setCsrfToken(response.headers.get('X-CSRFToken'))
                }
 		}
        return response;
    }

    rmJWTtoken()
    {
        this.rmCookie("JWTtoken")
    }
    getJWTtoken()
    {
        let tmp = this.getCookie("JWTtoken")
        //let tmp = window.localStorage.getItem("JWTtoken");
        return JSON.parse(tmp);
    }

    setJWTtoken(tk_access, tk_refresh)
    {
        this.JWTtoken =
        {
            access: tk_access,
            refresh: tk_refresh,
        }
        this.setCookie("JWTtoken", "Strict", JSON.stringify(this.JWTtoken), 1);
        //window.localStorage.setItem("JWTtoken", JSON.stringify(this.JWTtoken));

    }

    async checkJWTtoken()
    {
        let response = await this.get("/api/users/list/all/")
        if (response && response.ok)
            return true;
        else
        {
            console.log('rm tokens')
            this.rmCsrfToken()
            this.rmJWTtoken()
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
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    rmCookie = (name) =>
    {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC ; SameSite=None; Secure ; path=/";
    }

    setCookie(name, SameSite, value, days = 1) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; SameSite="+ SameSite +"; Secure ; path=/";
    }

    async getCsrfToken() {
        const csrfCookie = this.getCookie('X-CSRFToken')
        if (csrfCookie)
            return csrfCookie
        return null;
    }

    async setCsrfToken(csrftoken)
    {
        this.setCookie('X-CSRFToken', 'Strict', csrftoken, 1)
        //this.setCookie('csrftoken', 'Strict', csrftoken, 1)
    }

    async rmCsrfToken(csrftoken)
    {
        this.rmCookie('X-CSRFToken')
    }


}
