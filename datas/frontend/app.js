const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/public/';
const port = 3000;

router.use(function (req,res,next) {
	console.log('/' + req.method);
	next();
});
  
router.get('/template/:name', function (req, res) {
	console.log(req.params.name);
	/*
	var options = 
	{
		root: path,
		dotfiles: 'deny',
		headers:
		{
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}
	*/
	var fileName = req.params.name
	res.sendFile(path + '/javascripts/views/templates/' + fileName + '.html');
})


router.get('/*', function(req,res){
	res.sendFile(path + 'index.html');
});

router.get('/', function(req,res){
	res.sendFile(path + 'index.html');
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
	console.log('Example app listening on port %s!', port)
})

/*
const jsdom = require("jsdom").jsdom;
const {JSDOM} = jsdom;

class DOMParser {
	parseFromString(s, contentType = 'text/html') {
		return new JSDOM(s, {contentType}).window.document;
	}
}
*/


// const WebSocket = require('ws');
// const socket = new WebSocket.Server("ws://localhost:8080");

// socket.addEventListener("open", (event) => {
// 	console.log("Message from server ", event.data);
// 	socket.send("Hello Server!");
// })


// tuto: https://www.pubnub.com/blog/nodejs-websocket-programming-examples/
// debug: https://github.com/websockets/ws/issues/348#issuecomment-967803525
