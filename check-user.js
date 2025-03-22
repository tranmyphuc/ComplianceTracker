#!/usr/bin/env node

// Script to list all users in the backend
import fetch from 'node-fetch';

async function checkUsers() {
  try {
    const apiUrl = "http://localhost:5000/api/auth/login";
    console.log(`Checking login with admin credentials: ${apiUrl}`);
    
    const loginResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "phuc.tran@sgh.asia",
        password: "admin123"
      })
    });
    
    if (!loginResponse.ok) {
      console.error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
      
      let errorData = {};
      try {
        errorData = await loginResponse.json();
      } catch (e) {
        errorData = { error: loginResponse.statusText };
      }
      
      console.error("Error details:", errorData);
      console.log("Login failed. Let's check if the user exists in the database.");
    } else {
      const userData = await loginResponse.json();
      console.log("Login successful:", userData);
    }
  } catch (error) {
    console.error("Error checking users:", error.message || error);
  }
}

// Run the script
checkUsers();