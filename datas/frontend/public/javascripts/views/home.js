import AbstractView from "./AbstractView.js";
import * as friends_utils from "../utils_friends.js"
import * as router from "../router.js";
import { USER_STATUS } from "../config.js";

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
        this.add_invitations_received()
        this.add_invitations_sent()
        await this.add_pending_matches()
    }

    addEvents () {
        // WAITING_PLAYER
        let dom
        let response 


        // SUBSCRIBE
        dom = document.querySelector('.subscribe a')
        if (this.user.datas.status == USER_STATUS["WAITING_PLAYER"])
            dom.innerHTML = 'Unsubscribe from waiting list'
        else
            dom.innerHTML = 'Find a random oponent'
        if (dom){
        dom.addEventListener('click',  async e => 
        {
            e.preventDefault();
            if (e.target.innerHTML == 'Find a random oponent')
            {
                response = await this.user.request.post('/api/match/subscribe/', {})
                if (response.status == 201)
                {
                    let JSONResponse = await response.json()
                    console.warn(JSONResponse)
                    match_id = JSONResponse['match_id']
                    this.user.datas.status = USER_STATUS["PLAYING"];
                }else if (response.status == 200)
                {
                    e.target.innerHTML = 'Unsubscribe from waiting list'
                    this.user.datas.status = USER_STATUS["WAITING_PLAYER"];
                }
                this.user.saveDatasToLocalStorage()
            }
            else
            {
                response = await this.user.request.post('/api/match/unsubscribe/', {})
                if (response.ok)
                {
                    e.target.innerHTML = 'Find a random oponent'
                    this.user.datas.status = USER_STATUS["ONLINE"];
                    this.user.saveDatasToLocalStorage()
                }
            }
            console.log('response : ', response)
        })
    }

        dom = document.querySelector('.tournament a')
        if (this.user.datas.status == USER_STATUS["WAITING_TOURNAMENT"])
            dom.innerHTML = 'View my tournament page'
        else
            dom.innerHTML = 'Create a tournament'
        dom.addEventListener('click',  async e => {
            e.preventDefault();
            this.user.router.navigateTo('/tournament', this.user)
        })


    }

    async add_pending_matches ()
    {
        /* PENDING MATCHES */
        let nodePlayer1;
        let nodePlayer2;

        let dom = document.querySelector('#app .pending_matchs ul')
        let response = await this.user.request.post('/api/match/list/pending/')
        try{
            let JSONResponse = await response.json()
            JSONResponse.forEach(async match => {
                var newLi = document.createElement('li')
                newLi.classList.add('row', 'col-12');

                var nodePlayer1 = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null,  match['match_points'][0]['user_id'])
                nodePlayer1.classList.remove('col-12')
                nodePlayer1.classList.add('col-md-4')
                nodePlayer1.querySelector(".dropdown").innerHTML = ''
                friends_utils.update_status_text(nodePlayer1)
                var nodePlayer2 = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null,  match['match_points'][1]['user_id'])
                nodePlayer2.classList.remove('col-12')
                nodePlayer2.classList.add('col-md-4')
                nodePlayer2.querySelector(".dropdown").innerHTML = ''
                friends_utils.update_status_text(nodePlayer2)
                console.log(nodePlayer2)


                var VS = document.createElement('div')
                VS.classList.add('col-md-2', 'text-center')
                VS.innerHTML = '<h4>VS</h4>'

    
                var play_button = document.createElement('div')
                play_button.classList.add('col-md-2', 'text-center')
                play_button.innerHTML = '<a class="btn btn-primary btn-sm" role="button">play</a>'

                play_button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    this.user.router.navigateTo(`/play/online/${match['match_id']}`, this.user)
                });



                //newLi.innerHTML = `match ${match['match_id']} : ${match['players'][0]['alias']} vs ${match['players'][1]['alias']}`
                newLi.appendChild(nodePlayer1);
                newLi.appendChild(VS);
                newLi.appendChild(nodePlayer2);
                newLi.appendChild(play_button);
                dom.appendChild(newLi);

            })
        } catch (e) {
            console.error("Failed to parse JSON:", e); // Log any JSON parsing errors
            throw e; // Re-throw the error after logging it
        }
    }

    /***  INVITATIONS RECEIVED ***/
    add_invitations_received (){
        let nodeCopy;
        const received_invitations = this.user.datas.received_invitations
        if (received_invitations.length === 0)
            document.querySelector(`#app .invitations_received`).classList.add('d-none')
        else
        {
            received_invitations.forEach(async invitation => {
                nodeCopy = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, invitation)
                let friend_status = nodeCopy.getAttribute('data-friend-status');
                if (friend_status == USER_STATUS["OFFLINE"])
                    nodeCopy.querySelector(".dropdown").innerHTML = ''
                else
                {
                    let bt_accept = '<a class="accept btn btn-primary btn-sm" role="button">accept</a>'
                    let bt_deny = '<a class="deny btn btn-primary btn-sm" href="#" role="button">deny</a>'
                    
                    nodeCopy.querySelector(".dropdown").innerHTML = bt_accept + " " + bt_deny
                    bt_accept = nodeCopy.querySelector(".dropdown .accept")
                    bt_deny = nodeCopy.querySelector(".dropdown .deny")
                    bt_accept.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await friends_utils.invite(this.user, invitation, 'accept')
                    });
                    bt_deny.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await friends_utils.invite(this.user, invitation, 'deny')
                    });
                }
                document.querySelector(`#app .invitations_received ul`).append(nodeCopy);
            })
        }
    }



    /***  INVITATION SENT ***/
    add_invitations_sent (){
        let nodeCopy;
        const invitations_sent = this.user.datas.invitations_sent
        if (invitations_sent.length === 0)
            document.querySelector(`#app .invitations_sent`).classList.add('d-none')
        else
        {
            invitations_sent.forEach(async invitation => {
                console.log('invitation :', invitation)
                nodeCopy = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, invitation)
                let bt_cancel = '<a class="cancel btn btn-primary btn-sm" role="button">cancel</a>'
                nodeCopy.querySelector(".dropdown").innerHTML = bt_cancel
                bt_cancel = nodeCopy.querySelector(".dropdown .cancel")
                bt_cancel.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await friends_utils.invite(this.user, invitation, 'cancel')
                });
                document.querySelector(`#app .invitations_sent ul`).append(nodeCopy);
            })
        }
    }

}