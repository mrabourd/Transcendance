const express = require('express');
const cors = require('cors');
const app = express();

const router = express.Router();
app.use(cors());
router.use(cors());

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
const https = require('https');
const backendUrl = 'backend'; // Utilisez simplement 'backend' sans le préfixe 'http://'
const hostnameUrl = `${backendUrl}:8443`;
const options = {
    hostname: hostnameUrl,
    port: 8443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false // Ignorer la vérification du certificat SSL
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
*/
/*
const https = require('https');
const fs = require('fs');
const backendUrl = 'backend'; // Utilisez simplement 'backend' sans le préfixe 'http://'
const hostnameUrl = `${backendUrl}:8443`;
const options = {
    hostname: hostnameUrl,
    port: 8443,
    path: '/',
    method: 'GET',
    ca: fs.readFileSync('/etc/ssl/nginx-selfsigned.crt') // Chemin vers votre certificat SSL auto-signé
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
*/