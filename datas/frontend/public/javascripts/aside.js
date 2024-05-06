import * as friends_utils from "./utils_friends.js"

export async function print(user)
{
	let routes = null;

	let aside = document.querySelector("aside #friends");
	if (aside.hasChildNodes()) {
		console.log("has child node", aside.firstChild)
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
		let aside = document.querySelector('aside #friends')

		let nodeCopy;

		let response = await user.request.get('/api/users/all/')
		if (response.ok)
		{
			const friends = await response.json();
			friends.forEach(async friend => {
				if (friend.username === "root" || friend.username === user.datas.username)
					return;
				nodeCopy = await friends_utils.create_thumbnail(user, DOMProfileCard, friend)
				aside.append(nodeCopy);
			})
		}
	});


}