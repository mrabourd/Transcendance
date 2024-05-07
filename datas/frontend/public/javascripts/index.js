import User from "./user.js";
import * as router from "./router.js";

window.addEventListener("popstate", router.router);

document.addEventListener("DOMContentLoaded", async() => {

    const user = new User();
    const result = await user.checkLocalStorage();
    
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
    user.router = router
    router.router(user);
});