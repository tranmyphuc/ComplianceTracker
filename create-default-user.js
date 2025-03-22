#!/usr/bin/env node

// Script to create a default admin user in the backend without relying on Firebase
import fetch from 'node-fetch';

async function createDefaultUser() {
  try {
    // Admin user details
    const uid = "admin-default-" + Date.now();
    const email = "admin@example.com";
    const password = "admin123"; // Default password - should be changed on first login
    const username = "admin";
    const displayName = "Admin User";
    const department = "Executive";
    const role = "admin";
    
    console.log(`Creating default admin account...`);
    
    // Register directly to the backend
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
    
    console.log("Default admin account created successfully:", userData);
    
    console.log(`
========================================
Default Admin Account Created Successfully!
----------------------------------------
Email: ${email}
Password: ${password}
Role: ${role}
========================================
You can now login to the application with these credentials.
  `);
  } catch (error) {
    console.error("Error creating default admin account:", error.message || error);
  }
}

// Run the script
createDefaultUser();