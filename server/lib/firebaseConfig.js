
var firebase = require('firebase');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA5_bK4qg5hMxR85GXRVqv3byui4rdwBjI",
  authDomain: "consulting-3b708.firebaseapp.com",
  databaseURL: "https://consulting-3b708.firebaseio.com",
  projectId: "consulting-3b708",
  storageBucket: "consulting-3b708.appspot.com",
  messagingSenderId: "468905924416",
  appId: "1:468905924416:web:291a6e9c54d40e35060ca5",
  measurementId: "G-FGKGRLY5CB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


module.exports = firebase;

/*
const dbRef = firebase.firestore();
const usersRef = dbRef.collection('users');


firebase.auth().signInWithEmailAndPassword("jeremielodi@gmail.com", '12345678').then((reslt) => {
  console.log(reslt.user.displayName);
});
*/