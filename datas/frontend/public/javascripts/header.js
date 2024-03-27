export function printHeader(user)
{
  let routes = null;
  if (user.isConnected)
  {
  routes = [
      { path: "/home", libelle: "home" },
      { path: "/profile", libelle: "profile" },
      { path: "/about", libelle: "about" },
      { path: "/contact", libelle: "contact"  },
      { path: "/websocket", libelle: "websocket" },
      { path: "/play", libelle: "play" }];
  }else{
      routes = [
        { path: "/login", libelle: "login" },
        { path: "/register", libelle: "register" }
    ];
  }
  document.querySelector("header nav ul").innerHTML = "";
  document.querySelector("footer nav ul").innerHTML = "";
  let li;
  let cloned_li;
  routes.forEach(route => {
    li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link" aria-current="page" href="` + route.path + `" data-link>`+route.libelle+`</a>`
    cloned_li = li.cloneNode(true);
    document.querySelector("header nav ul").appendChild(li);
    document.querySelector("footer nav ul").appendChild(cloned_li)
  });
  if (user.isConnected)
  {
    li = document.createElement("li");
    li.classList.add("av-item", "active");
    li.innerHTML = `<a class="nav-link"  href="/logout" logout>logout</a>`
    cloned_li = li.cloneNode(true);
    document.querySelector("header nav ul").appendChild(li)
    document.querySelector("footer nav ul").appendChild(cloned_li)
  }
}
