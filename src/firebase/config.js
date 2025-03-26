// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase only if it hasn't been initialized yet
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', error.stack);
  }
}

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Export app for use in other files if needed
export default app;