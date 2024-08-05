// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjnfU7eZmqchl3m-ri1ltr20QvzmmodYc",
  authDomain: "inventory-tracker-274ab.firebaseapp.com",
  projectId: "inventory-tracker-274ab",
  storageBucket: "inventory-tracker-274ab.appspot.com",
  messagingSenderId: "519076281120",
  appId: "1:519076281120:web:c549c4db641330b51b3545",
  measurementId: "G-HC9KW03Q5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}