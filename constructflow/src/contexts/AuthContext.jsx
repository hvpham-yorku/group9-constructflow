// Authentication context provider - manages user login, signup, and session state
// All auth logic is centralized here and exposed through the useAuth hook
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

// Use this hook to access current user and auth functions anywhere in the app
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component - wraps entire app to handle authentication
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Firestore user doc
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Sign in existing user
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out current user
  async function logout() {
    return signOut(auth);
  }

  // Listen for auth state changes (when user logs in/out) so app can update
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserProfile(snap.exists() ? snap.data() : null);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Expose auth functions and current user to all child components
  const value = {
    currentUser,
    userProfile,   // has .role, .name, etc.
    signup,
    login,
    logout,
  };

  // Don't render children until we've checked auth status on app load
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
