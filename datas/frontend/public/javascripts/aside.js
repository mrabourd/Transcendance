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


	let notif_url = '/template/notif'
	await fetch(notif_url).then(function (response) {
		return response.text();
	}).then(async (html) => {
		let parser = new DOMParser();
		let doc = parser.parseFromString(html, 'text/html');
		let DOMNotif = doc.querySelector('.notif');
		

		// setup chat scoket
		const notifyScoket = new WebSocket(
			'wss://localhost:8443/ws/notify/?token=' + user.request.getJWTtoken()["access"] +'/'
		);
	
		// on socket open
		notifyScoket.onopen = function (e) {
			console.log('Socket successfully connected.');
		};
	
		// on socket close
		notifyScoket.onclose = function (e) {
			console.log('Socket closed unexpectedly');
		};
	
		// on receiving message on group
		notifyScoket.onmessage = function (e) {
			const data = JSON.parse(e.data);
			const message = data.message;
			// Call the setMessage function to add the new li element
			var newLi = document.createElement('li');

			// Create a new anchor element
			var newAnchor = document.createElement('a');
			newAnchor.className = 'dropdown-item text-wrap';
			newAnchor.href = '#';
			newAnchor.textContent = message;
		
			// Append the anchor element to the li element
			newLi.appendChild(newAnchor);
		
			// Get the ul element with the id "notify"
			var ulElement = document.getElementById('notify');
		
			// Append the new li element to the ul element
			ulElement.appendChild(newLi);
		
			// getting object of count
			count = document.getElementById('bellCount').getAttribute('data-count');
			document.getElementById('bellCount').setAttribute('data-count', parseInt(count) + 1);
	
		};
	});
		

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