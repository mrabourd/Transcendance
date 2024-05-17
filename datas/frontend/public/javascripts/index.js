import User from "./user.js";
import * as router from "./router.js";
import * as friends_utils from "./utils_friends.js"

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

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Parcourez les nœuds ajoutés
            mutation.addedNodes.forEach(function(node) {
                // Vérifiez si le nœud ajouté est une div avec la classe profile_card
                if (node instanceof HTMLElement && node.classList.contains('profile_card')) {
                    friends_utils.update_profile_cards(user, node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});