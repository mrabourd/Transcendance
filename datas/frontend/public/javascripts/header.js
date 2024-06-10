import * as friends_utils from "./utils_friends.js"

export async function print(user)
{
	let routes = null;
	if (user.isConnected)
	{
		routes = [
			{ path: "/home", libelle: "home" },
			{ path: "/profile", libelle: "profile" },
			{ path: "/tournament", libelle: "tournament" },
			{ path: "/play", libelle: "play"}
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

		
			li = document.createElement("li");
			li.classList.add(`"nav-link-` + route.libelle);
			li.setAttribute("id", route.libelle);
			li.innerHTML = `<a class="nav-link" id=link-` + route.libelle + ` aria-current="page" href="` + route.path + `" data-link>`+route.libelle+`</a>`
			document.querySelector("header nav ul").appendChild(li);

			document.querySelector(".notif").classList.add("d-none");
		

	});


	if (user.isConnected)
	{
		li = document.createElement("li");
		li.classList.add("av-item", "active");
		li.innerHTML = `<a class="nav-link"  href="/logout" logout>logout</a>`
		document.querySelector("header nav ul").appendChild(li)

		var user_thumbnail = await friends_utils.create_thumbnail(user.DOMProfileCard, user, null,  user.datas.id)
		document.querySelector("header .user_thumbnail").appendChild(user_thumbnail);		

		document.querySelector(".notif").classList.remove("d-none");
	}

}
