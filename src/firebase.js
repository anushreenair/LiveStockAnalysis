// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCctf7IJr4LZXamfuNDCmYo5VJvhODTCJg",
  authDomain: "projectstockwizard.firebaseapp.com",
  projectId: "projectstockwizard",
  storageBucket: "projectstockwizard.firebasestorage.app",
  messagingSenderId: "1046255423842",
  appId: "1:1046255423842:web:89238c59c848b1db625c3b",
  measurementId: "G-ZGVCVWVXK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };