import User from "./user.js";
import * as router from "./router.js";
import * as header from "./header.js";

window.addEventListener("popstate", router.router);

document.addEventListener("DOMContentLoaded", async() => {

    const user = new User();
    const result = await user.checkLocalStorage();
    header.printHeader(user);

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            router.navigateTo(e.target.href, user);
        }
        if (e.target.matches("[logout]")) {
            e.preventDefault();
            (async () => {
                await user.logout();
                router.navigateTo("/login", user);
            })();
            
        }
    });
    console.log("index.js", "user", user)
    router.router(user);
});