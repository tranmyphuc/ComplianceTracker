/**
 * Script to create demo users with different roles for testing the approval workflow
 */
import 'dotenv/config';
import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import bcrypt from 'bcryptjs';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Demo users to create with different roles
 */
const demoUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    displayName: 'Admin User',
    username: 'admin',
    role: 'admin',
    department: 'IT'
  },
  {
    email: 'approver@example.com',
    password: 'password123',
    displayName: 'Approval Manager',
    username: 'approver',
    role: 'admin',
    department: 'Legal & Compliance'
  },
  {
    email: 'operator@example.com',
    password: 'password123',
    displayName: 'System Operator',
    username: 'operator',
    role: 'operator',
    department: 'Operations'
  },
  {
    email: 'developer@example.com',
    password: 'password123',
    displayName: 'AI Developer',
    username: 'developer',
    role: 'developer',
    department: 'R&D'
  },
  {
    email: 'manager@example.com',
    password: 'password123',
    displayName: 'Decision Maker',
    username: 'manager',
    role: 'decision_maker',
    department: 'Executive'
  },
  {
    email: 'user@example.com',
    password: 'password123',
    displayName: 'Regular User',
    username: 'user',
    role: 'user',
    department: 'Marketing'
  }
];

/**
 * Create a user account in Firebase Auth and save to the database
 */
async function createUserAccount(userData) {
  try {
    console.log(`Creating user: ${userData.email} (${userData.role})`);
    
    // Check if user already exists in the database
    const existingUser = await db.select().from(users).where(users.email, '=', userData.email).limit(1);
    
    if (existingUser.length > 0) {
      console.log(`User ${userData.email} already exists. Skipping...`);
      return;
    }
    
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const uid = userCredential.user.uid;
    
    // 2. Update profile display name
    await updateProfile(userCredential.user, {
      displayName: userData.displayName
    });
    
    // 3. Hash password for database storage (separate from Firebase)
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 4. Insert user into database
    await db.insert(users).values({
      uid: uid,
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      department: userData.department,
      role: userData.role,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    console.log(`Successfully created user: ${userData.email}`);
    return uid;
  } catch (error) {
    console.error(`Error creating user ${userData.email}:`, error.message);
    
    // Handle Firebase email-already-in-use error
    if (error.code === 'auth/email-already-in-use') {
      console.log(`User ${userData.email} already exists in Firebase. Continuing with database update...`);
      // Try to get the UID for the existing Firebase user
      try {
        // This is a simplified approach - in a real app you'd use admin SDK
        // Just insert into the database with a generated UID for testing
        const dummyUid = `dummy_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Insert user into database with the dummy UID
        await db.insert(users).values({
          uid: dummyUid,
          email: userData.email,
          username: userData.username,
          displayName: userData.displayName,
          department: userData.department,
          role: userData.role,
          password: await bcrypt.hash(userData.password, 10),
          createdAt: new Date(),
          lastLogin: new Date()
        });
        
        console.log(`Added user ${userData.email} to database with dummy UID`);
        return dummyUid;
      } catch (dbError) {
        console.error(`Error adding user to database:`, dbError);
      }
    }
  }
}

/**
 * Create all demo users
 */
async function createAllDemoUsers() {
  try {
    console.log('Starting to create demo users...');
    
    // Create each user in sequence
    for (const userData of demoUsers) {
      await createUserAccount(userData);
    }
    
    console.log('Demo user creation completed successfully!');
    console.log('You can now log in with any of these accounts:');
    demoUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - password: ${user.password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
}

// Run the function
createAllDemoUsers();