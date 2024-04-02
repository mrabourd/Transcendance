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
		{ path: "/play", libelle: "play",
		sousmenu: [{path: "/vs_computer", libelle: "play with robot"},
		{path: "/vs_player", libelle: "play with player" }]
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
			li.innerHTML = `<div class="dropdown">
			<button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown">
			  play
			</button>
			<ul class="dropdown-menu" id="sousmenu">
				<li><a class="dropdown-item" id=link-` + route.sousmenu[0].libelle + ` aria-current="page" href="` + route.path + route.sousmenu[0].path + `" data-link>`+route.sousmenu[0].libelle+`</a></li>
				<li><a class="dropdown-item" id=link-` + route.sousmenu[1].libelle + ` aria-current="page" href="` + route.path + route.sousmenu[1].path + `" data-link>`+route.sousmenu[1].libelle+`</a></li>
			</ul>
		  </div>`;
		//   let child = document.getElementById("route.sousmenu[0]menu");
		//   console.log(child);
		//   route.sousmenu.forEach(sous => {
		// 	child.innerHTML +=  `<li><a class="dropdown-item" id=link-` + sous.libelle + ` aria-current="page" href="` + sous.path + `" data-link>`+sous.libelle+`</a></li>`
		//   })
			
		// 	let div;
		// 	div = document.createElement("div");
		// 	div.classList.add("dropdown-menu");
		// 	div.setAttribute("aria-labelledby", "navbarDropdown");
		// 	div.innerHTML = `<div class="dropdown">
		// 	<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
		// 	  Dropdown button
		// 	</button>
		// 	<ul class="dropdown-menu">
		// 	  <li><a class="dropdown-item" href="#">Link 1</a></li>
		// 	  <li><a class="dropdown-item" href="#">Link 2</a></li>
		// 	  <li><a class="dropdown-item" href="#">Link 3</a></li>
		// 	</ul>
		//   </div>`;
		// 	  li.appendChild(div);
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
