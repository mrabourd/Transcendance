const express = require('express');

const cors = require('cors');
const app = express();

const router = express.Router();
router.use(cors());

const path = __dirname + '/public/';
const port = 3000;

router.use(function (req,res,next) {
	console.log('/' + req.method);
	next();
});

router.get('/template/:name', function (req, res) {
	console.log(req.params.name);
	var fileName = req.params.name
	res.sendFile(path + '/javascripts/views/templates/' + fileName + '.html');
})

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("multer dest !")
    cb(null, '/home/node/app/profile_pics/') // Specify the directory where uploaded files should be stored
  },
  filename: function (req, file, cb) {
    console.log("multer filename !")
    //pour réglé le problème tu peut généré un timestamp
    // la date actuel sous forme de miliseconds ( donc un nombre entier )
    // qui ne contient pas de slash
    var dateMili = Date.now();

    cb(null, dateMili+"-"+Math.round(Math.random() * 10000)+"-"+file.originalname);
    
    cb(null, file.originalname) // Use the original filename for storing the file
  }
})

const upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.use('/profile_pics', express.static('profile_pics'))

app.post('/upload', upload.single('image'), function (req, res, next) {
  console.log("router post !")
  console.log(req.file.path)
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
});

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
