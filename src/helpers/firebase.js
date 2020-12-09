
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSNQDNzQLJLyJWnG40AO27_TY7gRkqjho",
    authDomain: "test-authentication-4be35.firebaseapp.com",
    databaseURL: "https://test-authentication-4be35.firebaseio.com",
    projectId: "test-authentication-4be35",
    storageBucket: "test-authentication-4be35.appspot.com",
    messagingSenderId: "679258537586",
    appId: "1:679258537586:web:00f41690d98a38435dcceb",
    measurementId: "G-6L8TCTHC4H"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;