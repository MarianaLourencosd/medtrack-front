// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZL5AMjbIDcugRZT8ICD5GL7w0WldNdUY",
  authDomain: "medtrackjgf.firebaseapp.com",
  projectId: "medtrackjgf",
  storageBucket: "medtrackjgf.firebasestorage.app",
  messagingSenderId: "435824970238",
  appId: "1:435824970238:web:78c3029ba41c228f62d8af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// auth
const auth = getAuth(app);

export { auth };