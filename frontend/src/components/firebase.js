// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYHKmdSPjKvHzYJDdw_Sot1Vjjl4r4XQ8",
  authDomain: "smart-pantry-tracker.firebaseapp.com",
  projectId: "smart-pantry-tracker",
  storageBucket: "smart-pantry-tracker.appspot.com",
  messagingSenderId: "735684165506",
  appId: "1:735684165506:web:d714210b25425b15c1999b",
  measurementId: "G-XH68FRZSFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Correct usage: pass the app instance to getAuth and getFirestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;