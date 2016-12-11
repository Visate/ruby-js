// Firebase database manager

// Modules and globals
const firebase = require("firebase");
const config = require("../config.json");

// Obtaining login creds from config file
const firebaseConf = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId
};

// Connecting to the database
firebase.initializeApp(firebaseConf);

const database = firebase.database();
