import Request from "./request.js";

export default class User {
    constructor() {
        this._isConnected = false;
        this._datas = {username:"john"};
        this.request = new Request;
		this.notifyScoket = null;
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
    async login(userName, passWord) {
        let RQ_Body = {username: userName, password: passWord};
        let response = await this.request.post('/api/users/login/', RQ_Body);
        let response_copy = response.clone();
        if (response_copy.ok) {
            let jsonData = await response_copy.json();
            this.setLocalDatas(jsonData.user);
            this.request.setJWTtoken(jsonData.access, jsonData.refresh);
            this.isConnected = true;
    
            /* const resp_csrf = await this.request.post('/api/users/ma_vue_protegee/');
            if (resp_csrf.status === 403) {
                console.warn("Attaque CSRF");
                return true;
            } */
			
            
            return true;
        } else  {
            return response;
        }
    }

    checkLocalStorage = async() => {
        this.datas = this.getLocalDatas();
        if (this.datas !== null)
        {
            let TockenCheck = await this.request.checkJWTtoken();
            if (TockenCheck == true)
            {
                this._isConnected = true;
            }
            else
            {
                this.rmLocalDatas();
                this.request.rmJWTtoken();
                this._isConnected = false;
            }
        }
        else
        {
            this._isConnected = false;
        }
        return this._isConnected;
    }

    getLocalDatas = () =>
    {
        let datas = window.localStorage.getItem("LocalDatas");
        this.datas = datas
        return JSON.parse(datas)
    }
    rmLocalDatas = () =>
    {
        this.datas = null
        localStorage.removeItem("LocalDatas");
    }

    setLocalDatas = (jsonData) =>
    {
        this.datas = jsonData;
        window.localStorage.setItem("LocalDatas", JSON.stringify(jsonData));
        //this.token = jsonData;
        // TODO enregistrer un cookie pour plus de securite
    }

    RefreshLocalDatas = async () =>
    {

        let response = await this.request.get('/api/users/profile/'+this.datas.id+'/')
        if (response.ok)
        {
            let jsonData = await response.json();
            window.localStorage.setItem("LocalDatas", JSON.stringify(jsonData));
            this.datas = jsonData;
            return true 
        }
        else
            return false
        //this.token = jsonData;
        // TODO enregistrer un cookie pour plus de securite
    }



    logout = async() =>{
        let RQ_Body = await this.request.getJWTtoken();
        let response = await this.request.post('/api/users/logout/', RQ_Body)
        if (response.ok) {
            this.rmLocalDatas();
            this.request.rmJWTtoken();
            this.request.rmCsrfToken();
            this._isConnected = false;
            this.router.navigateTo('/', this);
        }
    }
}