// Simple script to create an admin account in the MemStorage database

// Import required modules
const { storage } = require('./server/storage');

async function createAdminAccount() {
  // Define the admin user data
  const adminUserData = {
    email: "phuc.tran@sgh.asia",
    username: "admin",
    displayName: "Admin User",
    uid: `admin_${Date.now()}`, // Generate a unique ID
    role: "admin",
    department: "Executive"
  };
  
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(adminUserData.email);
    
    if (existingUser) {
      console.log("Admin user already exists:", existingUser);
      return existingUser;
    }
    
    // Create the admin user
    const adminUser = await storage.createUser(adminUserData);
    console.log("Admin user created successfully:", adminUser);
    
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

// Run the script
createAdminAccount()
  .then(() => {
    console.log("Admin account setup completed.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Failed to set up admin account:", error);
    process.exit(1);
  });
