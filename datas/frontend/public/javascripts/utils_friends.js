/// BLOCK FUNCTIONS
import {USER_STATUS} from "./constants.js";

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

export async function block(user, friend_id, action)
{
    let response = await user.request.get(`/api/users/${action}/${friend_id}/`)
    if (response.status == 200)
    {
        user.RefreshLocalDatas().then(() => {
            update_block_text(user, friend_id);
        });
    }
}

export async function update_block_text(user, friend_id) {
    let dom;
    let check = is_blocked(user, friend_id);
    let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
    profile_cards.forEach(profile_card => {
        dom = profile_card.querySelector('.block');
        if (dom)
            dom.innerHTML = (check) ? 'unblock' : 'block';
   
    });
}
export async function add_block_event(user, friend_id) {
    let dom;
    let check = is_blocked(user, friend_id);
    let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
    profile_cards.forEach(profile_card => {
        dom = profile_card.querySelector('.block');  
        dom.removeEventListener('click',async (e) => {})
        dom.addEventListener('click', async (e) => {
            e.preventDefault();
            block(user, friend_id, e.target.innerHTML )
        });
    });
}

/// STATUS
export async function update_status(user, friend_id, friend_status)
{
    let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
    
    profile_cards.forEach(profile_card => {
        let dom = profile_card.querySelector('.status');
        if (!dom)
            return;
        let text, color
        switch (friend_status)
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
    });
}

/// FOLLOW FUNCTIONS
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

export async function follow(user, friend_id, action)
{
    let response = await user.request.get(`/api/users/${action}/${friend_id}/`)
    if (response.status == 200)
    {
        user.RefreshLocalDatas().then(() => {
            update_follow_text(user, friend_id);
        });
    }
}

export async function update_follow_text(user, friend_id) {
    let dom;
    let check = is_followed(user, friend_id);

    let profile_cards
    
    profile_cards = document.querySelector(`.profile_card[data-friend-id="${friend_id}"]`);
    let followed_div_all = document.querySelectorAll(`aside .followed ul.userList`);
    followed_div_all.forEach( followed_div => {
        let test = followed_div.querySelector(`.profile_card[data-friend-id="${friend_id}"]`)
        if (check && !test && profile_cards)
        {
            followed_div.append(profile_cards.cloneNode(true))
            add_follow_event(user, friend_id)
        }
        else if (!check && test)
            test.remove()
    });

    profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
    profile_cards.forEach(profile_card => {
        dom = profile_card.querySelector('.follow');
        if (dom)
            dom.innerHTML = (check) ? 'unfollow' : 'follow';
    });
}
export async function add_follow_event(user, friend_id) {

    let profile_cards = document.querySelectorAll(`.profile_card[data-friend-id="${friend_id}"]`);
    profile_cards.forEach(profile_card => {
        let dom = profile_card.querySelector('.follow');
        dom.removeEventListener('click',async (e) => {})
        dom.addEventListener('click', async (e) => {
            e.preventDefault();
            follow(user, friend_id, e.target.innerHTML )
        });
    });
}
export async function create_thumbnail(nodeToCopy, user, friend) {
    const nodeCopy = nodeToCopy.cloneNode(true);
    const profile_url = "/profile/" + friend.id
    const chat_url = "/profile/" + friend.id

    await nodeCopy.setAttribute("data-friend-id", friend.id)
    nodeCopy.querySelector(".username").innerHTML = friend.username
    let avatar = (friend.avatar) ? friend.avatar : '/avatars/default.png'
    nodeCopy.querySelector("img.avatar").src = avatar
    nodeCopy.querySelector(".avatar").addEventListener('click', async (e) =>  {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });

    if (user.datas.id == friend.id)
    {
        nodeCopy.querySelector(".dropdown").innerHTML = ''
        return nodeCopy;
    }
    var dropdownToggle = nodeCopy.querySelector(".dropdown-toggle");
    var dropdown = new bootstrap.Dropdown(dropdownToggle);

    /* DropDown Menu */
    let menu = nodeCopy.querySelector(".dropdown-menu");
    
    // profile
    menu.querySelector('.profile').addEventListener('click', async (e) =>  {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });

    return nodeCopy;
}


export async function update_friends_thumbnails(user, friend)
{
    update_block_text(user, friend.id)
    update_follow_text(user, friend.id)
    update_status(user, friend.id, friend.status)
    add_block_event(user, friend.id)
    add_follow_event(user, friend.id)
}