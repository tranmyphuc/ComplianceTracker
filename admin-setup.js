// Admin account setup script for EU AI Act Compliance Platform
import { storage } from './server/storage.js';

async function createAdminAccount(email, password) {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      console.log(`Admin user with email ${email} already exists.`);
      return existingUser;
    }
    
    // Create admin user data
    const adminUserData = {
      email: email,
      username: email.split('@')[0],
      displayName: "Admin User",
      uid: `admin_${Date.now()}`, // Generate a unique identifier
      role: "admin",
      department: "Executive",
      password: password || "admin123" // Default password if none provided
    };
    
    // Create the admin user in storage
    const adminUser = await storage.createUser(adminUserData);
    console.log(`Admin user created successfully with email: ${email}`);
    console.log(adminUser);
    
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

function promptForPassword() {
  return "admin123"; // For simplicity, using a default password
}

async function main() {
  try {
    const adminEmail = process.argv[2] || "phuc.tran@sgh.asia";
    const password = promptForPassword();
    
    console.log(`Setting up admin account for ${adminEmail}...`);
    
    await createAdminAccount(adminEmail, password);
    
    console.log("Admin account setup completed successfully.");
    console.log(`You can now log in with email: ${adminEmail} and the provided password.`);
    
  } catch (error) {
    console.error("Admin account setup failed:", error);
    process.exit(1);
  }
}

// Run the main function
main();