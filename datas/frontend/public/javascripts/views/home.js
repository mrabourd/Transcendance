import AbstractView from "./AbstractView.js";
import * as friends_utils from "../utils_friends.js"
import * as router from "../router.js";
import { USER_STATUS } from "../constants.js";

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
        let nodeCopy;
        let test
        let response 
    
        /***  INVITATIONS RECEIVED ***/
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

        /***  INVITATION SENT ***/
        const invitation_sent = this.user.datas.invitation_sent
        if (invitation_sent == "" || invitation_sent == null)
            document.querySelector(`#app .invitation_sent`).classList.add('d-none')
        else
        {
            let friend = []
            friend.id = invitation_sent
            nodeCopy = await friends_utils.create_thumbnail(this.user.DOMProfileCard, this.user, null, friend.id)
            let bt_cancel = '<a class="cancel btn btn-primary btn-sm" role="button">cancel</a>'
            nodeCopy.querySelector(".dropdown").innerHTML = bt_cancel
            bt_cancel = nodeCopy.querySelector(".dropdown .cancel")
            bt_cancel.addEventListener('click', async (e) => {
                e.preventDefault();
                await friends_utils.invite(this.user, friend.id, 'cancel')
            });
            document.querySelector(`#app .invitation_sent ul`).append(nodeCopy);
        }


    }

    addEvents () {
        // WAITING_PLAYER
        let dom
        let response 


        // SUBSCRIBE
        dom = document.querySelector('.subscribe a')
        console.log("this.user.datas.status ", this.user.datas.status )
        if (this.user.datas.status == USER_STATUS["WAITING_PLAYER"])
            dom.innerHTML = 'Unsubscribe from waiting list'
        else if (this.user.datas.status == USER_STATUS["ONLINE"])
            dom.innerHTML = 'Find a random oponent'
        else
            dom.parentNode.remove();
        if (dom){
        dom.addEventListener('click',  async e => 
        {
            e.preventDefault();
            if (e.target.innerHTML == 'Find a random oponent')
            {
                response = await this.user.request.post('/api/match/subscribe/', {})
                e.target.innerHTML = 'Unsubscribe from waiting list'
                this.user.datas.status = USER_STATUS["WAITING_PLAYER"];
                this.user.saveDatasToLocalStorage()
                // if found >> redirect to match_id
            }
            else
                response = await this.user.request.post('/api/match/unsubscribe/', {})
            console.log('response : ', response)
        })
    }
        document.querySelector('.tournament a').addEventListener('click',  async e => 
        {
            e.preventDefault();
            this.user.router.navigateTo('/tournament', this.user)
        })
    }
}