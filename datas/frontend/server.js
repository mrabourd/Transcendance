
// --------- WEB SOCKER PART --------------

const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({ port: 8080 });

wss.on('connection', ws => {
	console.log('New client connected!');
	ws.send('connection established');

	ws.on('close', () => {
		console.log('Client has disconnected!');
	});

	ws.on('message', data => {
		wss.clients.forEach(client => {
			if (client !== ws && client.readyState === WebSocketServer.OPEN) {
                console.log(`Distributing message: ${data}`);
                client.send(`${data}`);
            }
		});
	});
	ws.onerror = function () {
		console.log('websocket error');
	}
})