import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDYh1TwKSeFz9InwAT0Edu-atEWi4d4rS4",
    authDomain: "ifeira-302ca.firebaseapp.com",
    databaseURL: "https://ifeira-302ca.firebaseio.com",
    projectId: "ifeira-302ca",
    storageBucket: "ifeira-302ca.appspot.com",
    messagingSenderId: "1059291240696",
    appId: "1:1059291240696:web:9bcb0cfd8920a421"
}

const Firebase = firebase.initializeApp(config);

export default Firebase;
    