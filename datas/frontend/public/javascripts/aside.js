import * as friends_utils from "./utils_friends.js"

export async function print(user)
{
	
	let routes = null;
	if (!user.isConnected)
		return;


	let aside = document.querySelector("aside .online");
	if (aside.hasChildNodes()) {
		if (!user.isConnected)
			aside.innerHTML = '';
		return;
	}
	aside = document.querySelector("aside .followed");
	if (aside.hasChildNodes()) {
		if (!user.isConnected)
			aside.innerHTML = '';
		return;
	}

	let profile_card_url = '/template/profile_card'
	await fetch(profile_card_url).then(function (response) {
		return response.text();
	}).then( async (html) => {
		let parser = new DOMParser();
		let doc = parser.parseFromString(html, 'text/html');
		let DOMProfileCard = doc.querySelector('.profile_card');

		let nodeCopy;
		let response;

		
		let detination_followed = document.querySelector('aside .followed')
		response = await user.request.get('/api/users/list/followed/')
		if (response.ok)
		{
			const friends = await response.json();
			console.log('>> follow', friends)

			friends.forEach(async friend => {
				if (friend.username === "root" || friend.username === user.datas.username)
					return;
				console.log('>> follow user', friend.username)
				nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
				detination_followed.append(nodeCopy);
				friends_utils.update_friends_thumbnails(user, friend)
			})
		}


		let detination_online = document.querySelector('aside .online')
		response = await user.request.get('/api/users/list/online/')
		if (response.ok)
		{
			const friends = await response.json();
			friends.forEach(async friend => {
				if (friend.username === "root" || friend.username === user.datas.username)
					return;
				nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
				detination_online.append(nodeCopy);
				friends_utils.update_friends_thumbnails(user, friend)
			})
		}

		let detination_all = document.querySelector('aside .all')
		response = await user.request.get('/api/users/list/all/')
		if (response.ok)
		{
			const friends = await response.json();
			friends.forEach(async friend => {
				if (friend.username === "root" || friend.username === user.datas.username)
					return;
				nodeCopy = await friends_utils.create_thumbnail(DOMProfileCard, user, friend)
				detination_all.append(nodeCopy);
				friends_utils.update_friends_thumbnails(user, friend)
			})
		}
	});


}