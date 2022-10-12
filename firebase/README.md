# Firebase Cloud Functions

Firebase Cloud Functions is a serverless and event-driven compute service for running backend code. We will be using Node.js + Express.js to build REST APIs as microservices. They will hosted on Cloud Functions. 

To install setup the Firebase CLI, run the following:

```sh
$ npm install -g firebase-tools
$ firebase login
```

After making any changes, change directory into the 'functions' folder and run the following command to deploy:

```sh
$ npm run deploy
```