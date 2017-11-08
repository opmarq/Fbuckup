## Internship Program Coding Challenge

### Idea of the app

A small Facebook-powered web app, that let the user export photos from Facebook to Firebase.

#### The scenario 

1. the user sign in using his Facebook account and grant access to his Facebook albums & photos.
2. The user will see a grid of his/her albums from Facebook.
3. The user can tap an album, and see the photos inside that album.
4. The user can select one or more photos from an album and export them to Firebase.

#### Technologies used

Those are the technologies i used to make the web app.

* Frontend
> ReactJS
* Backend
> NodeJS
* Third parties
> Firebase SDK

> Facebook SDK

#### How to run the app

> i'm using my firebase account and facebook app settings, i made them for the challenge purpose, and they don't contain anything sensitive so i think that it's okey to share them. 

1. Clone the repository
```
git clone 'repo'
```
2. you will need a web server to run the app, i'm using live-server which you can download from npm.

```
npm install -g live-server
```
3. go to the public directory and run

```
live-server
```
4. go to the server directory and run the node server

````
node server.js
````
> now the app is app and running you can sign in using your facebook account and backup your photos.
