import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Check all required environment variables
const checkFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing required Firebase configuration: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Construct auth domain from project ID if not explicitly provided
const getAuthDomain = () => {
  if (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
    return import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  }
  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return projectId ? `${projectId}.firebaseapp.com` : undefined;
};

// Construct storage bucket from project ID if not explicitly provided
const getStorageBucket = () => {
  if (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) {
    return import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  }
  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return projectId ? `${projectId}.appspot.com` : undefined;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: getAuthDomain(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: getStorageBucket(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function initializeFirebase() {
  try {
    if (!checkFirebaseConfig()) {
      console.warn("Firebase will not be initialized due to missing configuration.");
      return;
    }
    
    // Log configuration for debugging (without sensitive values)
    console.log("Firebase Config:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAppId: !!firebaseConfig.appId,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasStorageBucket: !!firebaseConfig.storageBucket
    });
    
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
  if (!auth) return null;
  return auth.currentUser;
};
