import * as utils from "./utils_form.js"

export async function print(user)
{
	let routes = null;

	if (user.isConnected)
	{
		let response = await user.request.get('/api/users/all/')
		// user.datas.follows.forEach(id => {
		// 	console.log("user.datas.id: ", id)})
		document.getElementById("friends").innerHTML = "Here are my friends: (connected)"
		if (response.ok)
		{   
			const users = await response.json();
			
			let displayFriends = document.querySelector("#friends");
			let follow_text;
			//display people:
			users.forEach(list_user => {
				if (list_user.username === "root" || list_user.username === user.datas.username)
					return;
				let avatar = (list_user.avatar == undefined) ? '/avatars/default.png' : list_user.avatar;
				let main_div	= utils.FormcreateElement("div", ["aside"]);
				let row			= utils.FormcreateElement("row", ["row"], {"style":"padding: 20px; border-top: 1px solid #f1f2f2;"});
				let data		= utils.FormcreateElement("data", ["col-5"]);
				let follow		= utils.FormcreateElement("div", ["col-2"]);

				// if the user is already followed : display `unfollow`. Otherwise, display `Follow!`
				if (user.datas.follows.id == undefined)
						follow_text = "Follow!";
				user.datas.follows.forEach(id => {
					if (id == list_user.id)
						follow_text = "Unfollow!";
					else
						follow_text = "Follow!";
				})
				console.log("follow text: ", follow_text);
				let msg	= utils.FormcreateElement("button", ["btn", "btn-primary"], {"innerText": follow_text,
					"id": 'followButton'+list_user.id,
					"type": "button"
				});

				let f_avatar  =  utils.FormcreateElement("img", ["rounded-circle", "col-3"], {"src": avatar, "style":"border-radius: 50%;"});
				let f_name = utils.FormcreateElement("div", ["h5"]);
				let f_link = utils.FormcreateElement("a", ["profile-link", "#href"], {"innerText": list_user.username});
				let f_status = utils.FormcreateElement("p", ["status"], {"innerText": "status:"}); //add status here
				utils.FormAppendElements(follow, msg);
				utils.FormAppendElements(data, f_name);
				utils.FormAppendElements(data, f_status);
				utils.FormAppendElements(row, f_avatar);
				utils.FormAppendElements(f_name, f_link);
				utils.FormAppendElements(row, data);
				utils.FormAppendElements(row, follow);
				utils.FormAppendElements(main_div, row);
				console.log("list_user avatar", list_user.username, avatar, list_user.isConnected);
				f_link.addEventListener('click', async () =>  {
			
					user.router.navigateTo("/profile/" + list_user.id, user);
				});

				displayFriends.appendChild(main_div);
				
				// When click on button, `follow` or `unfollow`
				document.getElementById('followButton'+list_user.id).addEventListener("click", async() => {
					let RQ_Body = {}
					let value =  document.getElementById('followButton'+list_user.id).innerText;
					if (value === "Follow!"){
						console.log("I want to follow: ", list_user.username)
						let response = await user.request.post('/api/users/follow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
							user.RefreshLocalDatas();
							console.log("following is done!");
						}
						else{
							console.log("response not okay");
						}
						
						document.getElementById('followButton'+list_user.id).innerText = "Unfollow!"
						// call follow
					}
					else if (value === "Unfollow!"){
						console.log("I want to UNfollow: ", list_user.username)

						let response = await user.request.post('/api/users/unfollow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
							user.RefreshLocalDatas();
							console.log("unfollowing is done!");

						}
						else{
							console.log("response for unfollow not okay")
						}
						document.getElementById('followButton'+list_user.id).innerText = "Follow!"
						// call unfollow
					}
				});

				
			}); 
			
			return true;
		} else if (response.status === 401) {
			const users = await response.json();
			return users.detail;
		}
		
	}else{
		console.log("print aside not connected")
		document.getElementById("friends").innerHTML = "(not connected)"
		
	}
}