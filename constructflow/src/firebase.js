// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFeJEiIPD4yTdljVrcpg0GxC-9opMV2s0",
  authDomain: "constructflow-3eceb.firebaseapp.com",
  projectId: "constructflow-3eceb",
  storageBucket: "constructflow-3eceb.firebasestorage.app",
  messagingSenderId: "986748380076",
  appId: "1:986748380076:web:3797343990a73b16361009",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
