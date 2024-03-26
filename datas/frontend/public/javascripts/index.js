import User from "./user.js";
import * as router from "./router.js";

window.addEventListener("popstate", router.router);

document.addEventListener("DOMContentLoaded", () => {

    const user = new User();
    user.checkLocalStorage();

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            router.navigateTo(e.target.href, user);
        }
    });
    router.router(user);
});