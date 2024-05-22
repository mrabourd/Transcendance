/// BLOCK FUNCTIONS
import {USER_STATUS} from "./constants.js";

export function is_invited(user,friend_id )
{
    if (user.datas.invitation_sent === friend_id) {
        return true
    }
    return false
}

export function is_blocked(user, friend_id)
{
    if (user.datas.blocks.length) {
        for (const id of user.datas.blocks){
            if (id && friend_id && id == friend_id)
                return true
        }
    }
    return false
}

export function is_followed(user, friend_id)
{
    if (user.datas.follows.length) {
        for (const id of user.datas.follows){
            if (id && friend_id && id == friend_id)
                return true
        }
    }
    return false
}

export async function block(user, friend_id, action)
{
    let response = await user.request.get(`/api/users/${action}/${friend_id}/`)
    if (response.status == 200)
    {
        await user.RefreshLocalDatas();
        // todo add/rm blocked user_id in local_datas
        let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"] .block`);
        profile_cards.forEach(dom => {
            dom.innerHTML = (action == 'block') ? 'unblock' : 'block';
        });
    }
}

export async function invite(user, friend_id, action)
{
    let response = await user.request.post(`/api/match/invite/${action}/${friend_id}/`)
    if (response.status == 200)
    {
        await user.RefreshLocalDatas();
        update_profile_cards_text(user)
    }
}
export async function follow(user, friend_id, action)
{
    let response = await user.request.get(`/api/users/${action}/${friend_id}/`)
    if (response.status == 200)
    {
        await user.RefreshLocalDatas();

        // todo add/rm followed user_id in local_datas
        // append/rm node in aside .follow
        let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"] .follow`);
        profile_cards.forEach(dom => {
            dom.innerHTML = (action == 'follow') ? 'unfollow' : 'follow';
        });

        let profile_card = document.querySelector(`.profile_card[data-friend-id="${friend_id}"]`);
        let followed_div = document.querySelector(`aside .followed ul.userList`);
        let test = followed_div.querySelector(`aside .profile_card[data-friend-id="${friend_id}"]`)
        if (action =='follow' && !test && profile_card)
            followed_div.append(profile_card.cloneNode(true))
        else if (action =='unfollow' && test)
            test.remove()
    }
}

export async function update_block_text(user, profile_card, friend_id) {
    let dom;
    let check = is_blocked(user, friend_id);
    dom = profile_card.querySelector('.block');
    if (dom)
        dom.innerHTML = (check) ? 'unblock' : 'block';
}

export async function update_follow_text(user, profile_card, friend_id) {
    let dom;
    let check = is_followed(user, friend_id);
    dom = profile_card.querySelector('.follow');
    if (dom)
        dom.innerHTML = (check) ? 'unfollow' : 'follow';
}


export async function update_invite_text(user, profile_card, friend_id) {
    /// TODO / update invite en fonction des status
    let dom;
    let check = is_invited(user, friend_id)
    let friend_status = profile_card.getAttribute('data-friend-status');

    dom = profile_card.querySelector('.invite');

    if (!dom)
        return ;
    if ( (parseInt(friend_status) != USER_STATUS['ONLINE']) || 
        (parseInt(user.datas.status) != USER_STATUS['ONLINE'] 
        && !check))
    {
        dom.classList.add('d-none')
        return ;
    }
    dom.classList.remove('d-none')
    if (!check)
        dom.innerHTML = 'invite to play';
    else
        dom.innerHTML = 'cancel invitation';
}


export async function add_block_event(user, profile_card, friend_id) {
    let dom;
    dom = profile_card.querySelector('.block');
    if (!dom)
        return
    dom.removeEventListener('click', async (e) => {})
    dom.addEventListener('click', async (e) => {
        e.preventDefault();
        block(user, friend_id, e.target.innerHTML)
    });
}
export async function add_follow_event(user, profile_card, friend_id) {
    let dom = profile_card.querySelector('.follow');
    if (!dom)
        return
    dom.removeEventListener('click',async (e) => {})
    dom.addEventListener('click', async (e) => {
        e.preventDefault();
        follow(user, friend_id, e.target.innerHTML)
    });
}
export async function add_profile_event(user, profile_card, friend_id) {
    let dom = profile_card.querySelector('.profile');
    if (!dom)
        return
    const profile_url = "/profile/" + friend_id
    dom.removeEventListener('click',async (e) => {})
    dom.addEventListener('click', async (e) => {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });
    profile_card.querySelector(".avatar").removeEventListener('click',async (e) => {})
    profile_card.querySelector(".avatar").addEventListener('click', async (e) =>  {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });
}

export async function add_chat_event(user, profile_card, friend_id) {
	let dom = profile_card.querySelector('.chat');
	if (!dom)
		return
	dom.removeEventListener('click',async (e) => {})
	dom.addEventListener('click', async (e) => {
		e.preventDefault();
		let chat_url = "/chatroom/" + friend_id + "/"
		user.router.navigateTo(chat_url, user);
	});
}


export async function add_invite_event(user, profile_card, profile_id)
{
    let dom = profile_card.querySelector('.invite');
    if (!dom)
        return
    dom.removeEventListener('click',async (e) => {})
    dom.addEventListener('click', async (e) => {
        e.preventDefault();
        let action = (e.target.innerHTML == 'invite to play') ? 'send' : 'cancel'
        invite(user, profile_id, action)
    });
}

/// STATUS
export async function update_status_text(user, profile_card)
{
    let friend_status = profile_card.getAttribute('data-friend-status');
    let dom = profile_card.querySelector('.status');
    if (!dom)
        return;
    let text, color
    switch (parseInt(friend_status))
    {
        case USER_STATUS['OFFLINE'] :
            text = 'offline'
            color = 'text-danger'
            break
        case USER_STATUS['ONLINE'] :
            text = 'online'
            color = 'text-success'
            break
        default:
            text = 'playing ...'
            color = 'text-primary'
            break
    }
    dom.innerHTML = text
    dom.removeAttribute('class')
    dom.classList.add(color)
}

export async function update_invite(user, friend_id) {
    let dom;
    // let check = is_waiting(user, friend_id);
    let check = false;
    let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);

    profile_cards.forEach(profile_card => {
        dom = profile_card.querySelector('.play');
        if (dom){
            dom.innerHTML = (check) ? 'invite to play' : 'invited';
        }
    });
    // change my status to waiting...
}

export async function create_thumbnail(nodeToCopy, user, friend) {
    const nodeCopy = nodeToCopy.cloneNode(true);
    await nodeCopy.setAttribute("data-friend-id", friend.id)
    await nodeCopy.setAttribute("data-friend-status", friend.status)
    nodeCopy.querySelector(".username").innerHTML = friend.username
    nodeCopy.querySelector(".id").innerHTML = friend.id
    let avatar = (friend.avatar) ? friend.avatar : '/avatars/default.png'
    nodeCopy.querySelector("img.avatar").src = avatar

    if (user.datas.id == friend.id)
    {
        nodeCopy.querySelector(".dropdown").innerHTML = ''
        return nodeCopy;
    }
    var dropdownToggle = nodeCopy.querySelector(".dropdown-toggle");
    var dropdown = new bootstrap.Dropdown(dropdownToggle);
    return nodeCopy;
}

export function update_profile_cards_text(user)
{
    let profile_cards = document.querySelectorAll(`.profile_card`);

    profile_cards.forEach(profile_card => {
        let profile_id = profile_card.getAttribute('data-friend-id');
        update_block_text(user, profile_card, profile_id)
        update_follow_text(user, profile_card, profile_id)
        update_status_text(user, profile_card)
        update_invite_text(user, profile_card, profile_id)
    });
}

export function update_profile_cards(user, profile_card)
{
    let profile_id = profile_card.getAttribute('data-friend-id');
    update_block_text(user, profile_card, profile_id)
    update_follow_text(user, profile_card, profile_id)
    update_status_text(user, profile_card)
    update_invite_text(user, profile_card, profile_id)
    
    add_follow_event(user, profile_card, profile_id)
    add_block_event(user, profile_card, profile_id)
    add_profile_event(user, profile_card, profile_id)
    add_invite_event(user, profile_card, profile_id)
    add_chat_event(user, profile_card, profile_id)
}