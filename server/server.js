const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const request = require("request")
const fs = require('fs');
const cors = require('cors');
const firebase = require('firebase');
const googleStorage = require('@google-cloud/storage');
const app = express();


app.use(cors()); // allow CSRF

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

  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  
  // Sign in with credential from the Google user.
  firebase.auth().signInWithCredential(credential).catch((error)=> console.log(error) );

  firebase.auth().onAuthStateChanged((user)=>{
    
    if (user) {
      
      //console.log(user.displayName)

      urls.forEach((url)=>{

        let fileName = url.match(/\/(\w+)\//)[1];

        requestImage(url).then((data)=>{

          let file = {
            buffer: data,
            name: `${user.uid}/${ fileName }.jpg`,
            mime: "image/png"
          }
        
          uploadImageToStorage(file).then((data)=>{
        
            console.log(data);
        
          });

        });

      });

    } else {

      console.log("not signed in!!");
    
    }
  });


});

app.listen(8000);


const requestImage= (url)=> new Promise((resolve,reject)=>{

  var requestSettings = {
    url: url,
    method: 'GET',
    encoding: null
  };
  
  request(requestSettings, function(error, response, body) {
    
    if(!body)
      reject("No image file");
    
    resolve(body);

  });

});


const uploadImageToStorage = (file) => {

  let prom = new Promise((resolve, reject) => {
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
       //The public URL can be used to directly access the file via HTTP.

      const url = util.format(`https://storage.googleapis.com/${bucket.name}/${file.name}`);

      resolve(url);

    });

    blobStream.end(file.buffer);

  });
  return prom;
}


