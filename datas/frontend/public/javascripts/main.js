function show(page, param) {
    var contentDiv = document.getElementById("content");

    switch(page){
        case "about" :
            show_about_page(contentDiv);
            break;
        case "contact" :
            show_contact_page(contentDiv);
            break;
        case "play" :
            show_play_page(contentDiv);
            break;
        case "profile" :
            show_profile_page(contentDiv, param);
            break;
        case "home" :
        default :
            show_home_page(contentDiv);
            break;
        
    }
}

document.addEventListener('DOMContentLoaded', function (){
    let url = location.hash.substring(1);
    let param = url.split("/");
    let page = param[0];
    param.shift();
    show(page, param);
});

window.addEventListener("hashchange", function() {
    let url = location.hash.substring(1);
    let param = url.split("/");
    let page = param[0];
    param.shift(); 
    show(page, param);
});

