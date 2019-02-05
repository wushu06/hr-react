import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAi-5mux8RL8olu2XebWpKyH8wHK_dPFfU",
    authDomain: "user-manager-2f572.firebaseapp.com",
    databaseURL: "https://user-manager-2f572.firebaseio.com",
    projectId: "user-manager-2f572",
    storageBucket: "user-manager-2f572.appspot.com",
    messagingSenderId: "58276152278"
};
firebase.initializeApp(config);

export default firebase;