/**
 * Script to create demo users with different roles for production deployment
 */
require('dotenv').config();
const admin = require('firebase-admin');
const { db } = require('./server/db');
const { users } = require('./shared/schema');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

// Demo user data for different roles
const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    username: 'admin',
    role: 'admin',
    department: 'Administration'
  },
  {
    email: 'technical@demo.com',
    password: 'Technical123!',
    displayName: 'Technical User',
    username: 'technical',
    role: 'technical',
    department: 'IT Department'
  },
  {
    email: 'legal@demo.com',
    password: 'Legal123!',
    displayName: 'Legal User',
    username: 'legal',
    role: 'legal',
    department: 'Legal Department'
  },
  {
    email: 'decision@demo.com',
    password: 'Decision123!',
    displayName: 'Decision Maker',
    username: 'decision',
    role: 'decision_maker',
    department: 'Executive Office'
  },
  {
    email: 'operator@demo.com',
    password: 'Operator123!',
    displayName: 'Operator User',
    username: 'operator',
    role: 'operator',
    department: 'Operations'
  }
];

/**
 * Create a user account in Firebase Auth and save to the database
 */
async function createUserAccount(userData) {
  try {
    console.log(`Processing user: ${userData.email}`);
    
    // Check if user already exists in Firebase
    try {
      const userRecord = await admin.auth().getUserByEmail(userData.email);
      console.log(`User ${userData.email} already exists in Firebase. Updating...`);
      
      // Update user display name if needed
      if (userRecord.displayName !== userData.displayName) {
        await admin.auth().updateUser(userRecord.uid, {
          displayName: userData.displayName
        });
      }
      
      // Check if user exists in database
      const existingUser = await db.select().from(users).where(users.firebase_uid === userRecord.uid);
      
      if (existingUser && existingUser.length > 0) {
        console.log(`User ${userData.email} already exists in the database. Updating...`);
        await db.update(users)
          .set({
            display_name: userData.displayName,
            role: userData.role,
            department: userData.department,
            updated_at: new Date()
          })
          .where(users.firebase_uid === userRecord.uid);
      } else {
        console.log(`User ${userData.email} exists in Firebase but not in database. Creating database entry...`);
        await db.insert(users).values({
          firebase_uid: userRecord.uid,
          username: userData.username,
          display_name: userData.displayName,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      return userRecord.uid;
    } catch (error) {
      // User doesn't exist in Firebase, create new
      if (error.code === 'auth/user-not-found') {
        console.log(`Creating new user: ${userData.email}`);
        const userRecord = await admin.auth().createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true
        });
        
        console.log(`User ${userData.email} created in Firebase. Creating database entry...`);
        await db.insert(users).values({
          firebase_uid: userRecord.uid,
          username: userData.username,
          display_name: userData.displayName,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          created_at: new Date(),
          updated_at: new Date()
        });
        
        return userRecord.uid;
      } else {
        throw error; // Rethrow if it's not a 'user-not-found' error
      }
    }
  } catch (error) {
    console.error(`Error creating user ${userData.email}:`, error);
    throw error;
  }
}

/**
 * Create all demo users
 */
async function createAllDemoUsers() {
  try {
    console.log('Starting creation of demo users...');
    
    for (const userData of demoUsers) {
      try {
        const uid = await createUserAccount(userData);
        console.log(`Successfully processed user ${userData.email} with UID: ${uid}`);
      } catch (error) {
        console.error(`Failed to process user ${userData.email}:`, error);
        // Continue with next user even if one fails
      }
    }
    
    console.log('Demo user creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error in createAllDemoUsers:', error);
    process.exit(1);
  }
}

// Run the script
createAllDemoUsers();