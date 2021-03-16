import * as firebase from "firebase/app";
import "firebase/auth";
require('dotenv').config()

const app = firebase.initializeApp({
    apiKey: "AIzaSyC5fhW7ksJx6_t7P1nWtG94kQcWyEQHz90" ||process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "foodshala-70013.firebaseapp.com" || process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: "https://foodshala-70013.firebaseio.com" || process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: "foodshala-70013" || process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: "foodshala-70013.appspot.com" || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "333161145808" || process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: "1:333161145808:web:ad08a9544d6f99d0c085d5" || process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-JFBN56JGWF" || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});
export default app;