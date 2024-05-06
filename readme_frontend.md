CONNECTION :
au chargement : checklocaltoken() (TODO backend utiliser une autre URL a cet effet )







	if (user.isConnected)
	{
		let response = await user.request.get('/api/users/all/')
		// user.datas.follows.forEach(id => {
		// 	console.log("user.datas.id: ", id)})
		if (response.ok)
		{   
			const users = await response.json();
			let displayFriends = document.querySelector("#friends");
			let follow_text;

			// Get User Thumb page HTML
			await fetch( '/template/profile_history').then(function (response) {
				return response.text();
			}).then(function (html) {
				let parser = new DOMParser();
				let doc = parser.parseFromString(html, 'text/html');
				document.querySelector('.tab-content').append(doc.querySelector('body div'));
			});


			//display people:
			users.forEach(list_user => {
				if (list_user.username === "root" || list_user.username === user.datas.username)
					return;
				let avatar = (list_user.avatar == undefined) ? '/avatars/default.png' : list_user.avatar;
				let main_div	= utils.FormcreateElement("div", ["aside"]);
				let row			= utils.FormcreateElement("row", ["row", "mx-auto"]);
				let data		= utils.FormcreateElement("data", ["col", "justify-content-center"]);
				let follow		= utils.FormcreateElement("div", ["col-3", "justify-content-end"]);

				console.log ("my id: ", user.datas.id)
				// if the user is already followed : display `unfollow`. Otherwise, display `Follow!`
				if (list_user.id == undefined){
					follow_text = "Follow!";
				}
				if (user.datas.follows.length) {

					for (const id of user.datas.follows){
						// console.log("id de qui je follow: ", id)
						if (id && list_user.id && id == list_user.id){
							follow_text = "Unfollow!";
							break ;
						}
						else if (id != list_user.id) {
							follow_text = "Follow!";
						}
					}
				}
				else{
					follow_text = "Follow!";
				}
				// au lieu create
				// $(.follow.=)
				let msg	= utils.FormcreateElement("button", ["btn", "btn-primary"], {"innerText": follow_text,
					"id": 'followButton'+list_user.id,
					"type": "button"
				});

				let f_avatar = utils.FormcreateElement("img", ["col-4", "img-fluid", "avatar-md", "rounded-circle", "justify-content-start", "picture-src"], {"src": avatar, "style":"height: 80px; width: 100px;"});
				let f_name = utils.FormcreateElement("div", ["col", "h5"]);
				let f_link = utils.FormcreateElement("a", ["profile-link", "#href"], {"innerText": list_user.username});
				
				let status = 0;
				if (list_user.status == 0)
					status = "Not connected"
				else if (list_user.status == 1)
					status = "Ready to play!"
				else if (list_user.status == 2)
					status = "Already playing!"
				let f_status = utils.FormcreateElement("p", ["status"], {"innerText": status});

				utils.FormAppendElements(follow, msg);
				utils.FormAppendElements(data, f_name);
				utils.FormAppendElements(data, f_status);
				utils.FormAppendElements(row, f_avatar);
				utils.FormAppendElements(f_name, f_link);
				utils.FormAppendElements(row, data);
				utils.FormAppendElements(row, follow);
				utils.FormAppendElements(main_div, row);
				f_link.addEventListener('click', async () =>  {
					user.router.navigateTo("/profile/" + list_user.id, user);
				});

				displayFriends.appendChild(main_div);
				
				// When click on button, `follow` or `unfollow`
				document.getElementById('followButton'+list_user.id).addEventListener("click", async() => {
					let RQ_Body = {}
					let value =  document.getElementById('followButton'+list_user.id).innerText;
					if (value === "Follow!"){
						let response = await user.request.post('/api/users/follow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
							user.RefreshLocalDatas();
						}
						else{
							console.log("response not okay");
						}
						
						document.getElementById('followButton'+list_user.id).innerText = "Unfollow!"
						// call follow
					}
					else if (value === "Unfollow!"){

						let response = await user.request.post('/api/users/unfollow/'+list_user.id+'/', RQ_Body)
						if (response.ok)
						{
							let jsonData = await response.json();
							user.RefreshLocalDatas();

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
		
	}
