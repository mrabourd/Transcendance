import {USER_STATUS} from "./config.js";



export function send_message(user,friend_id )
{
    //console.log('datas',user.datas)
    console.log("send_message", user.datas.id)
    if (user.datas.id == friend_id) {
		return false
	}

	const chatSocket = new WebSocket(
		'wss://'+user.request.url_backend+':8443/ws/msg/'+ friend_id +'?token=' + user.request.getJWTtoken()["access"] +'/'
	);
	
	// on socket open
	chatSocket.onopen = function (e) {
		console.log('Socket successfully connected.');
	};
	
	// on socket close
	chatSocket.onclose = function (e) {
		console.log('Socket closed unexpectedly');
	};
	
	// on receiving message on group
	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const message = data.message;
		// Call the setMessage function to add the new li element
		

	}
}