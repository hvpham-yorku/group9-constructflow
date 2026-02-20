// Authentication context provider - manages user login, signup, and session state
// All auth logic is centralized here and exposed through the useAuth hook
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

// Use this hook to access current user and auth functions anywhere in the app
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component - wraps entire app to handle authentication
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user account with email and password
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Expose auth functions and current user to all child components
  const value = {
    currentUser,
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
