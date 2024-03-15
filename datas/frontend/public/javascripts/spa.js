
window.addEventListener("hashchange", function() {
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = location.hash;
});
