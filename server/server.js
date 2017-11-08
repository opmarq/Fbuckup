const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const request = require("request")
const cors = require('cors');
const firebase = require('firebase');
const googleStorage = require('@google-cloud/storage');
const app = express();


app.use(cors()); // allow CSFR
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


var config = {
  apiKey: "AIzaSyCNfpWAOSSCacueDGfmoedXPdLaGC66Wo4",
  authDomain: "wouldyou-9cb01.firebaseapp.com",
  databaseURL: "https://wouldyou-9cb01.firebaseio.com",
  projectId: "wouldyou-9cb01",
  storageBucket: "wouldyou-9cb01.appspot.com",
  messagingSenderId: "10270368950"
};

firebase.initializeApp(config);

const storage = googleStorage({
  projectId: "wouldyou-9cb01",
  keyFilename: "./key.json"
});

const bucket = storage.bucket("wouldyou-9cb01.appspot.com");


// if the user try to access server directly!

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('What are doing here ?');
});


app.post('/backup', function (req, res) {

  let urls = JSON.parse(req.body.urls);
  let token = req.body.fbtoken;

  // passing the facebook token

  const credential = firebase.auth.FacebookAuthProvider.credential(token);

  // Sign in with credential from the Google user.
  firebase.auth().signInWithCredential(credential).catch((error) => console.log(error));

  firebase.auth().onAuthStateChanged((user) => {

    if (user) {

      //console.log(user.displayName

      Promise.all(urls.map((url) => uploadPromise(user,url))).then((values)=>{

        res.end("done");

      }).catch((error)=>{

        res.end("error");

      });

    } else {

      console.log("not signed in!!");

    }
  });


});

app.listen(8000);


// this promise will reuqest the image from the url and also upload it to firebase

const uploadPromise = (user,url) => {

  let fileName = url.match(/\/(\w+)\//)[1];

  return new Promise((resolve, reject) => {

    requestImage(url).then((blob) => {

      let file = {
        buffer: blob,
        name: `${user.uid}/${fileName}.jpg`,
        mime: "image/jpg"
      }

      uploadImageToStorage(file).then( data => {

        resolve(data);

      }).catch(error =>{

        reject(error);

      });

    });

  });

}


const requestImage = (url) => new Promise((resolve, reject) => {

  var requestSettings = {
    url: url,
    method: 'GET',
    encoding: null
  };

  request(requestSettings, function (error, response, body) {

    if (!body)
      reject("No image file");

    resolve(body);

  });

});


const uploadImageToStorage = (file) => {

  return new Promise((resolve, reject) => {

    if (!file) {
      reject('No image file');
    }

    let fileUpload = bucket.file(file.name);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mime
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong!');
    });

    blobStream.on('finish', () => {

      const url = util.format(`https://storage.googleapis.com/${bucket.name}/${file.name}`);

      resolve(url);

    });

    blobStream.end(file.buffer);

  });
}


