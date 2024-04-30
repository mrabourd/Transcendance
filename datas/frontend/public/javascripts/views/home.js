import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("home");
    }


    async getHtml(DOM) {
        await fetch('/template/home').then(function (response) {
            return response.text();
        }).then(function (html) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let body = doc.querySelector('#app');
            DOM.innerHTML = body.innerHTML;
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }
    async fillHtml(DOM) {
        //console.log("fillHtml")
    }
    addEvents () {
        document.querySelector('#subscribe a').addEventListener('click',  async e => 
        {
            e.preventDefault();
            console.log(this.user.datas.id)
            console.log("subscribe")
            response = await this.user.request.post('api/match/subscribe/', {})
            console.log('response : ', response)
        })
        //console.log("Add Events")
    }
    // fonction specifiques a la vue
}