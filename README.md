### Idea of the app

A small Facebook-powered web app, that let the user export photos from Facebook to Firebase.

#### The scenario 

1. The user sign in using his Facebook account and grant access to his Facebook albums & photos.
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

> i'm using my firebase & facebook account configuration that i've created for the purpose of this demo to make the test easy, so feel free to use it.

1. Clone the repository.
```
git clone https://github.com/opmarq/Fbuckup.git
```
2. You will need a web server to run the app, i'm using live-server which you can download from npm.

```
npm install -g live-server
```
3. Go to the public directory and run.

```
live-server
```
4. Go to the server directory and install all the dependencies by running this npm cmd.

```
npm install
```
5. Once the dependencies are installed you can run the node server.
````
node server.js
````
> The app is up and running you can sign in using your facebook account and backup your photos.
> Since the facebook app is in dev mode, you will need me to add you as a tester.
