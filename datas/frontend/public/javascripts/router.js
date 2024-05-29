import login from "./views/login.js";
import login42 from "./views/login42.js";
import login2FA from "./views/login2FA.js";
import home from "./views/home.js";
import tournament from "./views/tournament.js";
import contact from "./views/contact.js";
import play from "./views/play.js";
import profile from "./views/profile.js";
import register from "./views/register.js";
import chatroom from "./views/chatroom.js";
import mpchat from "./views/mpchat.js";


export const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

export const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

export const navigateTo = (url, user) => {
    
    history.pushState(null, null, url);
    router(user);
};

export const router = async (user) => {
    const routes = [
        { id:0, path: "/", view: login },
        { id:1, path: "/login", view: login },
        { id:1, path: "/login42", view: login42 },
        { id:1, path: "/login2FA", view: login2FA },
        { id:2, path: "/register", view: register },
        { id:3, path: "/home", view: home },
        { id:4, path: "/profile", view: profile },
        { id:5, path: "/profile/:user_id", view: profile },
        { id:6, path: "/tournament", view: tournament },
        { id:7, path: "/contact", view: contact },
        { id:8, path: "/chatroom", view: chatroom },
		{ id:8, path: "/chatroom/:friend_id", view: mpchat},
        { id:9, path: "/play/:adversaire", view: play }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    // check user.isConnected & rediriger si necessaire
    let path = location.pathname;
    let isConnected = user.isConnected;
    if (match.route.id > 2 && !isConnected)
    {
        navigateTo("/login", user);
        return;
    }
    if (match.route.id < 3 && isConnected)
    {
        navigateTo("/home", user);
        return;
    }
    user.view = new match.route.view(getParams(match));
    user.view.user = user;




    await user.view.getHtml(document.querySelector("#app"));
    await user.view.fillHtml();
    await user.view.addEvents();
};
