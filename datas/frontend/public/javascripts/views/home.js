import AbstractView from "./AbstractView.js";
import * as friends_utils from "../utils_friends.js"
import * as router from "../router.js";

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
                invitation.id = invitation.sender
                nodeCopy = await friends_utils.create_thumbnail(this.DOMProfileCard, this.user, invitation)
                let bt_accept = '<a class="accept btn btn-primary btn-sm" role="button">accept</a>'
                let bt_deny = '<a class="deny btn btn-primary btn-sm" href="#" role="button">deny</a>'
                nodeCopy.querySelector(".dropdown").innerHTML = bt_accept + " " + bt_deny
                
                bt_accept = nodeCopy.querySelector(".dropdown .accept")
                bt_deny = nodeCopy.querySelector(".dropdown .deny")


                bt_accept.addEventListener('click', async (e) => {
                    e.preventDefault();
                    let response 
                    try {
                    response = await this.user.request.post(`/api/match/invite/accept/${invitation.sender}/`)
                    if (response.status === 200)
                    {
                        let JSONresponse = await response.json();
                        router.navigateTo('/play/online/' + JSONresponse.match_id, this.user);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
                });

            
                bt_deny.addEventListener('click', async (e) => {
                    e.preventDefault();
                    let response = await this.user.request.post(`/api/match/invite/deny/${invitation.sender}/`)
                    if (response.status == 200)
                    {
                        document.querySelector(`#app .invitations_received .profile_card[data-friend-id="${invitation.sender}"]`).remove()
                    }
                });
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
            nodeCopy = await friends_utils.create_thumbnail(this.DOMProfileCard, this.user, friend)
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
        document.querySelector('#subscribe a').addEventListener('click',  async e => 
        {
            e.preventDefault();
            console.log(this.user.datas.id)
            console.log("subscribe")
            let response = await this.user.request.post('/api/match/subscribe/', {})
            console.log('response : ', response)
        })
    }
}