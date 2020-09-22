import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDJNVeuY3AVgr88L1wJtdCcD4AFUQ3qux0",
    authDomain: "wall-of-tags.firebaseapp.com",
    databaseURL: "https://wall-of-tags.firebaseio.com",
    projectId: "wall-of-tags",
    storageBucket: "wall-of-tags.appspot.com",
    messagingSenderId: "988587985235",
    appId: "1:988587985235:web:d2145957e4525ebacff9a6",
    measurementId: "G-5NGZ4253X3"
  };
  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth();