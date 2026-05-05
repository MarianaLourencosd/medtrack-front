
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZL5AMjbIDcugRZT8ICD5GL7w0WldNdUY",
  authDomain: "medtrackjgf.firebaseapp.com",
  projectId: "medtrackjgf",
  storageBucket: "medtrackjgf.firebasestorage.app",
  messagingSenderId: "435824970238",
  appId: "1:435824970238:web:eb558cf86bea7edd62d8af"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const auth = getAuth(app);

export { auth };