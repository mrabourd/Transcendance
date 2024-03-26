import login from "./views/login.js";
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import play from "./views/play.js";
import profile from "./views/profile.js";
import register from "./views/register.js";


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
        { path: "/", view: login },
        { path: "/register", view: register },
        { path: "/home", view: home },
        { path: "/profile", view: profile },
        { path: "/profile/:id", view: profile },
        { path: "/about", view: about },
        { path: "/contact", view: contact },
        { path: "/play", view: play }
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

    user.view = new match.route.view(getParams(match));
    user.view.user = user;
    
   await user.view.getHtml(document.querySelector("#app"));
   await user.view.fillHtml();
   await user.view.printHeader();
   await user.view.addEvents();
};
