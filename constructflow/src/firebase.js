// Firebase setup - handles authentication and cloud database for ConstructFlow
// Initializes app with credentials from Firebase console
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration from project console
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

// Firebase Auth for user login and signup
export const auth = getAuth(app);
