#!/usr/bin/env node

// Register admin account script for EU AI Act Compliance Platform
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env files (try both root and client)
dotenv.config({ path: resolve(__dirname, '.env') });
dotenv.config({ path: resolve(__dirname, 'client', '.env') });

// Log the available environment variables (without showing values)
console.log("Available environment variables:", {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? "***" : undefined,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? "***" : undefined,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ? "***" : undefined,
});

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

async function createAdminAccount() {
  try {
    // Debug Firebase configuration
    console.log("Firebase Configuration:", {
      apiKey: firebaseConfig.apiKey ? "***" : "NOT SET",
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      appId: firebaseConfig.appId ? "***" : "NOT SET",
    });
    
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
      throw new Error("Firebase configuration is incomplete. Make sure all required environment variables are set.");
    }
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Admin user details
    const email = "phuc.tran@sgh.asia";
    const password = "admin123"; // Default password
    const username = "admin";
    const displayName = "Admin User";
    const department = "Executive";
    const role = "admin";
    
    console.log(`Creating admin account for ${email}...`);
    
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Firebase user created:", user.uid);
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    console.log("Firebase profile updated");
    
    // Register in the backend
    const apiUrl = "http://localhost:5000/api/auth/register";
    console.log(`Registering user in backend: ${apiUrl}`);
    
    // Create the backend registration payload
    // Note: registerSchema expects: username, email, password, displayName?, department?, role?
    // We also pass the Firebase UID which will be extracted separately in the API
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: user.uid, // Pass Firebase UID for the backend
        username: username,
        email: email,
        password: password,
        displayName: displayName,
        department: department,
        role: role
      })
    });
    
    if (!apiResponse.ok) {
      let errorData = {};
      try {
        errorData = await apiResponse.json();
      } catch (e) {
        console.error("Failed to parse error response:", e);
        errorData = { error: apiResponse.statusText };
      }
      console.error("Backend registration failed:", errorData);
      throw new Error(`Backend registration failed: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    let userData = {};
    try {
      userData = await apiResponse.json();
    } catch (e) {
      console.warn("Failed to parse user data response:", e);
      userData = { message: "User likely created but couldn't parse response" };
    }
    console.log("Admin account created successfully in backend:", userData);
    
    console.log(`
========================================
Admin Account Created Successfully!
----------------------------------------
Email: ${email}
Password: ${password}
Role: ${role}
========================================
You can now login to the application with these credentials.
    `);
    
    // Sign out to avoid conflicts
    await auth.signOut();
    
  } catch (error) {
    console.error("Error creating admin account:", error);
    
    if (error.code === "auth/email-already-in-use") {
      console.log("The email address is already in use. The admin account might already exist.");
    } else if (error.code === "auth/invalid-api-key") {
      console.error("Firebase API key is invalid. Please check your environment variables.");
    } else if (error.code === "auth/invalid-project-id") {
      console.error("Firebase Project ID is invalid. Please check your environment variables.");
    } else {
      console.error("Detailed error:", error.message || error);
    }
  }
}

// Execute the function
createAdminAccount();