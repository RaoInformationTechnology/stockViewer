import firebase from 'firebase'
// import 'firebase/firestore'
// import "firebase/auth";
// import firestore from 'firebase/firestore';
// import auth from 'firebase/auth';
 
// const settings = {timestampsInSnapshots: true};
// firebase.settings(settings);
// const timestamp = snapshot.get('created_at'); 
// const date =timestamp.toDate();


const config = {
  apiKey: "AIzaSyDi5b1509TgaL4SRLLHDIaX6RMKI4do7eU",
    authDomain: "crud-9e9b3.firebaseapp.com",
    databaseURL: "https://crud-9e9b3.firebaseio.com",
    projectId: "crud-9e9b3",
    storageBucket: "crud-9e9b3.appspot.com",
    messagingSenderId: "508003176857",
    appId: "1:508003176857:web:e69ef846f54c440f"
};
firebase.initializeApp(config);

firebase.firestore().settings({});
export default firebase;