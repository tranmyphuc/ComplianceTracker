#!/usr/bin/env node

// Admin creation script using Firebase Admin SDK
import admin from 'firebase-admin';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env files
dotenv.config({ path: resolve(__dirname, '.env') });
dotenv.config({ path: resolve(__dirname, 'client', '.env') });

// Log the available environment variables (without showing sensitive values)
console.log("Available environment variables:", {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? "***" : undefined,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? "***" : undefined,
});

// Initialize Firebase Admin SDK
// Note: Firebase Admin SDK typically uses service account credentials
// For simplicity in this demo, we'll use the default application credentials
try {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  process.exit(1);
}

async function createAdminUser() {
  try {
    // Admin user details
    const email = "phuc.tran@sgh.asia";
    const password = "admin123"; // Default password - should be changed on first login
    const username = "admin";
    const displayName = "Admin User";
    const department = "Executive";
    const role = "admin";
    
    console.log(`Creating admin account for ${email}...`);
    
    // Check if user already exists
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log("User already exists:", userRecord.uid);
      await handleExistingUser(userRecord, { displayName, username, department, role });
      return;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
      // User doesn't exist, continue with creation
    }
    
    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    
    console.log("Firebase user created:", userRecord.uid);
    
    // Register in the backend
    await registerInBackend(userRecord.uid, email, username, displayName, department, role, password);
    
  } catch (error) {
    console.error("Error creating admin account:", error);
    if (error.code === 'auth/email-already-in-use') {
      console.log("The email address is already in use. The admin account might already exist.");
    } else {
      console.error("Detailed error:", error.message || error);
    }
  }
}

async function handleExistingUser(userRecord, { displayName, username, department, role }) {
  // Update user profile if needed
  if (userRecord.displayName !== displayName) {
    await admin.auth().updateUser(userRecord.uid, {
      displayName
    });
    console.log("Updated display name for existing user");
  }
  
  // Try to register in backend (might be redundant if user already exists there)
  try {
    await registerInBackend(userRecord.uid, userRecord.email, username, displayName, department, role, "admin123");
  } catch (error) {
    if (error.message.includes('409')) {
      console.log("User already exists in backend, no need to register again");
    } else {
      throw error;
    }
  }
}

async function registerInBackend(uid, email, username, displayName, department, role, password) {
  const apiUrl = "http://localhost:5000/api/auth/register";
  console.log(`Registering user in backend: ${apiUrl}`);
  
  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uid,
      username,
      email,
      password,
      displayName,
      department,
      role
    })
  });
  
  if (!apiResponse.ok) {
    let errorData = {};
    try {
      errorData = await apiResponse.json();
    } catch (e) {
      errorData = { error: apiResponse.statusText };
    }
    console.error("Backend registration failed:", errorData);
    throw new Error(`Backend registration failed: ${apiResponse.status} ${apiResponse.statusText}`);
  }
  
  let userData = {};
  try {
    userData = await apiResponse.json();
  } catch (e) {
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
}

// Run the script
createAdminUser().finally(() => {
  // Gracefully exit when done
  process.exit(0);
});