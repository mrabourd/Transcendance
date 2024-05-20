import * as friends_utils from "./utils_friends.js"


	// Create a new li element



export async function print(user)
{
	
	let routes = null;
	if (!user.isConnected)
	{
		document.querySelector('aside').classList.add('d-none')
		return;
	}
	else
		document.querySelector('aside').classList.remove('d-none')


	
		

	let profile_card_url = '/template/profile_card'
	await fetch(profile_card_url).then(function (response) {
		return response.text();
	}).then( async (html) => {
		let parser = new DOMParser();
		let doc = parser.parseFromString(html, 'text/html');
		let DOMProfileCard = doc.querySelector('.profile_card');

		let nodeCopy;
		let response;
		let test
		let friends

		response = await user.request.get('/api/users/list/followed/')
		if (response.ok)
		{
		friends = await response.json();
		friends.forEach(async friend => {
			if (friend.username === "root" || friend.username === user.datas.username)
				return;
			let followed_div_all = document.querySelectorAll(`aside .followed ul.userList`);
			followed_div_all.forEach( async detination_followed => {
				test = detination_followed.querySelector(`.profile_card[data-friend-id="${friend.id}"]`);
				if (test)
					return;
				nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
				detination_followed.append(nodeCopy);
			});
		})
		}

		let detination_online = document.querySelector('aside .online ul.userList')
		if (!detination_online.hasChildNodes())
		{
			response = await user.request.get('/api/users/list/online/')
			if (response.ok)
			{
				const friends = await response.json();
				friends.forEach(async friend => {
					if (friend.username === "root" || friend.username === user.datas.username)
						return;
					test = detination_online.querySelector(`.profile_card[data-friend-id="${friend.id}"]`);
					if (test)
						return;
					nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
					detination_online.append(nodeCopy);
				})
			}
		}

		let detination_all = document.querySelector('aside .all ul.userList')
		if (!detination_all.hasChildNodes())
		{
			response = await user.request.get('/api/users/list/all/')
			if (response.ok)
			{
				const friends = await response.json();
				friends.forEach(async friend => {
					if (friend.username === "root" || friend.username === user.datas.username)
						return;
					test = detination_all.querySelector(`.profile_card[data-friend-id="${friend.id}"]`);
					if (test)
						return;
					nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
					detination_all.append(nodeCopy);
				})
			}
		}
	});


}