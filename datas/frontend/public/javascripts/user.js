import Request from "./request.js";

export default class User {
    constructor() {
        console.log("User constructor called")
        this._isConnected = false;
        this._datas = {username:"john"};
        this.request = new Request;
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
        console.log("user login()")
        let RQ_Body = {username: userName, password: passWord}
        let response = await this.request.post('/api/users/login/', RQ_Body)
        if (response.ok)
        {          
            const jsonData = await response.json();

            console.log("jsonData.access:", jsonData.access);
            console.log("jsonData.refresh:", jsonData.refresh);
            console.log("jsonData.user:", jsonData.user);

            this.setLocalDatas(jsonData.user)
            this.request.setLocalToken(jsonData.access, jsonData.refresh)

            this.isConnected = true;
            this.view.printHeader();
            return true;
        } else if (response.status === 401) {
            const jsonData = await response.json();
            return jsonData.detail;
        }
    }
    
    checkLocalStorage = async() => {
        console.log("checkLocalStorage");
        this.datas = this.getLocalDatas();
        if (this.datas !== null)
        {
            let TockenCheck = await this.request.checkLocalToken();
            if (TockenCheck == true)
            {

                this._isConnected = true;
            }
            else
            {
                this.rmLocalDatas();
                this.request.rmLocalToken();
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



    logout = async() =>{
        console.log("user logout()")
        let RQ_Body = {};
        let response = await this.request.post('/api/users/logout/', RQ_Body)
        //if (response.ok) {
            this.rmLocalDatas();
            this.request.rmLocalToken();
            this._isConnected = false;
            this.view.printHeader();
        //}
    }
}