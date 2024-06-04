import * as friends_utils from "./utils_friends.js"

export function print(user)
{
	let routes = null;
	if (user.isConnected)
	{
		routes = [
			{ path: "/home", libelle: "home" },
			{ path: "/profile", libelle: "profile" },
			{ path: "/tournament", libelle: "tournament" },
			{ path: "/play", libelle: "play",
			sousmenu: [{path: "/vs_computer", libelle: "play with robot"},
			{path: "/vs_player", libelle: "play with player" },
			{path: "/online", libelle: "play online" }]
			}
		];
	}else{
		routes = [
		{ path: "/login", libelle: "login" },
		{ path: "/register", libelle: "register" }
		];
	}

	document.querySelector("header nav ul").innerHTML = "";
	document.querySelector("footer nav ul").innerHTML = "";


	let li;

	routes.forEach(route => {

		if (route.libelle == "play")
		{
			li = document.createElement("li");
			li.classList.add(`"nav-link-` + route.libelle);
			li.setAttribute("id", route.libelle);

			li.innerHTML = `<div class="dropdown">
			<button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown">
			  play
			</button>
			<ul class="dropdown-menu" id="sousmenu">
				<li><a class="dropdown-item" id=link-` + route.sousmenu[0].libelle + ` aria-current="page" href="` + route.path + route.sousmenu[0].path + `" data-link>`+route.sousmenu[0].libelle+`</a></li>
				<li><a class="dropdown-item" id=link-` + route.sousmenu[1].libelle + ` aria-current="page" href="` + route.path + route.sousmenu[1].path + `" data-link>`+route.sousmenu[1].libelle+`</a></li>
				<li><a class="dropdown-item" id=link-` + route.sousmenu[2].libelle + ` aria-current="page" href="` + route.path + route.sousmenu[2].path + `" data-link>`+route.sousmenu[2].libelle+`</a></li>
			</ul>
		  </div>`;

			document.querySelector("header nav ul").appendChild(li);
		}
		else {
			li = document.createElement("li");
			li.classList.add(`"nav-link-` + route.libelle);
			li.setAttribute("id", route.libelle);
			li.innerHTML = `<a class="nav-link" id=link-` + route.libelle + ` aria-current="page" href="` + route.path + `" data-link>`+route.libelle+`</a>`
			document.querySelector("header nav ul").appendChild(li);

		}

	});


	if (user.isConnected)
	{
		li = document.createElement("li");
		li.classList.add("av-item", "active");
		li.innerHTML = `<a class="nav-link"  href="/logout" logout>logout</a>`
		document.querySelector("header nav ul").appendChild(li)
		
		document.querySelector(".user").innerHTML = user.datas.username;
	}

}
