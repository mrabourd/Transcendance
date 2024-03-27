import User from "./user.js";
import * as router from "./router.js";

window.addEventListener("popstate", router.router);

document.addEventListener("DOMContentLoaded", async() => {

    const user = new User();
    const result = await user.checkLocalStorage();
    console.log("checkLocalStorage", "result", result)

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            router.navigateTo(e.target.href, user);
        }
    });
    console.log("index.js", "user", user)
    router.router(user);
});