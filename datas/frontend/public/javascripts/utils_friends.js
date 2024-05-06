export async function create_thumbnail(user, nodeToCopy, friend) {
    const nodeCopy = nodeToCopy.cloneNode(true);
    const profile_url = "/profile/" + friend.id

    nodeCopy.querySelector(".username").innerHTML = friend.username

    nodeCopy.querySelector(".avatar").src = friend.avatar
    nodeCopy.querySelector(".avatar").addEventListener('click', async (e) =>  {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });


    /* DropDown Menu */
    let menu = nodeCopy.querySelector(".dropdown-menu");
    menu.querySelector('.profile').addEventListener('click', async (e) =>  {
        e.preventDefault();
        user.router.navigateTo(profile_url, user);
    });
    var dropdownToggle = nodeCopy.querySelector(".dropdown-toggle");
    var dropdown = new bootstrap.Dropdown(dropdownToggle);

    
    return nodeCopy;
}
