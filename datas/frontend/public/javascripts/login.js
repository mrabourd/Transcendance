
function login () {
	
	let baliseNom = document.getElementById("NameId");
	// console.log(baliseNom);
	let UserName = baliseNom.value;
	// console.log(uname); // affiche ce qui est contenu dans la balise name
	
	let balisePassword = document.getElementById("PasswordId");
	let UserPassword = balisePassword.value;
	  
	// const nameUser = JSON.parse(localStorage.getItem("username")) || [];
	// loginData = [{
	// 	loginName: UserName}, {
	// 	loginPass: UserPassword
	// 	}];
	// nameUser.push(loginData)
	// localStorage.setItem("username", JSON.stringify(nameUser))
	// console.log(nameUser)
	// location.reload()
    fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: UserName, password: UserPassword})
  })
	.then(res => res.json())
	// .then(res => console.log(res));
	// .then((res) =>
	// {
	// 	if (!res.ok) {
	// 		document.getElementById("finishLogin").innerHTML = "This user doesn't exist!";
	// 	}
	// 	else
	// 		console.log("bravo, you are logged in")
	// })
	.then(data => {
		if (data.success) {
			localStorage.setItem("username", UserName);
			localStorage.setItem("password", UserPassword);
			console.log("bravo, you are logged in")
		} else {
			alert(data.message);
		}
	})
	// .catch(error => {
	// 	console.error('Erreur:', error);
	// })
};
