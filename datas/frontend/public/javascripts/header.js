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
		{ path: "/play", libelle: "play"
		// sousmenu: [{path: "/vs_computer", libelle: "play with robot"},
		// {path: "/vs_player", libelle: "play with player" }]
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
			// li.setAttribute("data-toggle", "collapse");
			// li.setAttribute("aria-label", "Toggle navigation");
			li.innerHTML = `<a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">`;
			
			let div;
			div = document.createElement("div");
			div.classList.add("dropdown-menu");
			div.setAttribute("aria-labelledby", "navbarDropdown");
			// div.innerHTML = `<li class="nav-item dropdown">
			// <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
			// Dropdown
			// </a>
			// <div class="dropdown-menu" aria-labelledby="navbarDropdown">
			//   <a class="dropdown-item" href="/vs_computer">Play with computer</a>
			//   <a class="dropdown-item" href="#">Another action</a>
			//   <div class="dropdown-divider"></div>
			//   <a class="dropdown-item" href="#">Something else here</a>
			//   </div>
			//   </li>`;
			  li.appendChild(div);
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
	/* 

	document.querySelector("header nav ul").appendChild(div); */

	if (user.isConnected)
	{
		li = document.createElement("li");
		li.classList.add("av-item", "active");
		li.innerHTML = `<a class="nav-link"  href="/logout" logout>logout</a>`
		document.querySelector("header nav ul").appendChild(li)
	}
}
