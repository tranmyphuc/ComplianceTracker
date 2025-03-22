#!/usr/bin/env node

// Admin creation script using Firebase Auth REST API
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

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// Log the available environment variables (without showing sensitive values)
console.log("Available environment variables:", {
  FIREBASE_API_KEY: FIREBASE_API_KEY ? "***" : undefined,
  FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID
});

if (!FIREBASE_API_KEY) {
  console.error("FIREBASE_API_KEY is required but not found in environment variables");
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
    
    // Create user using Firebase Auth REST API
    const signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const signupResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    
    const signupData = await signupResponse.json();
    
    if (!signupResponse.ok) {
      // Handle existing user case
      if (signupData.error && signupData.error.message === 'EMAIL_EXISTS') {
        console.log("User already exists in Firebase. Attempting to sign in...");
        return await signInExistingUser(email, password, username, displayName, department, role);
      }
      
      throw new Error(`Firebase signup failed: ${JSON.stringify(signupData.error)}`);
    }
    
    console.log(`Firebase user created: ${signupData.localId}`);
    
    // Update profile with display name
    const idToken = signupData.idToken;
    const userId = signupData.localId;
    
    await updateProfile(idToken, displayName);
    
    // Register in the backend
    await registerInBackend(userId, email, username, displayName, department, role, password);
    
  } catch (error) {
    console.error("Error creating admin account:", error.message || error);
  }
}

async function signInExistingUser(email, password, username, displayName, department, role) {
  const signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
  const signinResponse = await fetch(signinUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  });
  
  const signinData = await signinResponse.json();
  
  if (!signinResponse.ok) {
    if (signinData.error && signinData.error.message === 'INVALID_PASSWORD') {
      console.error("User exists but password is incorrect. Cannot proceed with automatic registration.");
      console.log("You may need to manually reset the password in Firebase console.");
      return;
    }
    throw new Error(`Firebase signin failed: ${JSON.stringify(signinData.error)}`);
  }
  
  console.log(`Signed in to existing user: ${signinData.localId}`);
  
  // Update profile if needed
  await updateProfile(signinData.idToken, displayName);
  
  // Try to register in backend
  try {
    await registerInBackend(signinData.localId, email, username, displayName, department, role, password);
  } catch (error) {
    if (error.message.includes('409')) {
      console.log("User already exists in backend, no need to register again");
    } else {
      throw error;
    }
  }
}

async function updateProfile(idToken, displayName) {
  const updateUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
  const updateResponse = await fetch(updateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      idToken,
      displayName,
      returnSecureToken: false
    })
  });
  
  if (!updateResponse.ok) {
    const updateData = await updateResponse.json();
    throw new Error(`Firebase profile update failed: ${JSON.stringify(updateData.error)}`);
  }
  
  console.log("Firebase profile updated with display name");
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
  setTimeout(() => process.exit(0), 1000);
});