// Register admin account script for EU AI Act Compliance Platform
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import fetch from "node-fetch";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID
};

async function createAdminAccount() {
  try {
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
    const apiResponse = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: user.uid,
        email: email,
        username: username,
        displayName: displayName,
        department: department,
        role: role,
        password: password
      })
    });
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Backend registration failed:", errorData);
      throw new Error("Backend registration failed");
    }
    
    const userData = await apiResponse.json();
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
    }
  }
}

// Execute the function
createAdminAccount();