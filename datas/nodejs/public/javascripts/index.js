import login from "./views/login.js";
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import play from "./views/play.js";
import profile from "./views/profile.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: login },
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

    const view = new match.route.view(getParams(match));
    let html = await view.getHtml();
    console.log(">>>>>>>>>");
    console.log(html.body.firstChild.textContent);
    console.log("<<<<<<>>>>>>");

    document.querySelector("#app").innerText = html.body.firstChild.textContent;
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});