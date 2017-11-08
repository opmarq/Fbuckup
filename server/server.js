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


// initializing the connection with firebase 

var config = {
  apiKey: "AIzaSyDM3xxc5yjvE3BQDvhpFxx78kFkMrN46yQ",
  authDomain: "hiddenchalenge.firebaseapp.com",
  databaseURL: "https://hiddenchalenge.firebaseio.com",
  projectId: "hiddenchalenge",
  storageBucket: "hiddenchalenge.appspot.com",
  messagingSenderId: "110340634009"
};
firebase.initializeApp(config);

// initializing the connection withe gcloud.

const storage = googleStorage({
  projectId: "hiddenchalenge",
  keyFilename: "./key.json"
});

const bucket = storage.bucket("hiddenchalenge.appspot.com");


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

        console.log(values);

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


// this promise will request the image from the url and also upload it to firebase

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


// request the blob of the image from a specified url 

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


// getting the blob of the image and uploading it to firebase 

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


