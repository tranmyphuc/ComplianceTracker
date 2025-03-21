import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyALXq8l1aS-LTHrXpnwjRkZHr6AGzMRbz8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eu-ai-act-compliance.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eu-ai-act-compliance",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eu-ai-act-compliance.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
let app;
let auth;
let firestore;
let storage;

export function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

// Export Firebase services
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getFirebaseFirestore = () => firestore;
export const getFirebaseStorage = () => storage;

// Helper functions for authentication
export const getCurrentUser = () => {
  return getAuth().currentUser;
};
