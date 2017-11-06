const firebase = require("firebase-admin");
const express = require('express');
const bodyParser = require('body-parser');
const downloader = require("./modules/downloader");

var cors = require('cors');

const serviceAccount = require("./key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://hiddenchalenge.firebaseio.com"
});

const app = express();

app.use(cors()); // allow CSRF

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// if the user try to access server directly!

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('What are doing here ?');
});


app.post('/backup', function (req, res) {

  let urls = JSON.parse(req.body.urls);
  let token = req.body.fbtoken;

  urls.forEach((imgurl) => {

    downloader.saveImages(imgurl,function(feedback){

      console.log(feedback);

    });

  });

  res.end("done");

});

app.listen(8000);
