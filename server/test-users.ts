/**
 * Test users configuration
 * 
 * This file provides test user accounts for development and testing
 * without requiring Firebase authentication setup.
 */
import { User, userRoleEnum } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "./middleware/auth-middleware";

export interface TestUser extends User {
  password: string;
}

/**
 * Test users with different roles for development and testing
 */
export const testUsers: TestUser[] = [
  {
    id: 1,
    uid: "admin-uid",
    username: "admin",
    email: "admin@example.com",
    password: "password123", // In a real app, this would be hashed
    displayName: "Admin User",
    role: "admin" as UserRole,
    department: "Executive",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 2,
    uid: "operator-uid",
    username: "operator",
    email: "operator@example.com",
    password: "password123", // In a real app, this would be hashed
    displayName: "Operator User",
    role: "operator" as UserRole,
    department: "Engineering",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 3,
    uid: "developer-uid",
    username: "developer",
    email: "developer@example.com",
    password: "password123", // In a real app, this would be hashed
    displayName: "Developer User",
    role: "developer" as UserRole,
    department: "Engineering",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 4,
    uid: "decision-maker-uid",
    username: "decision_maker",
    email: "decision.maker@example.com",
    password: "password123", // In a real app, this would be hashed
    displayName: "Decision Maker",
    role: "decision_maker" as UserRole,
    department: "Executive",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 5,
    uid: "user-uid",
    username: "user",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    displayName: "Regular User",
    role: "user" as UserRole,
    department: "Marketing",
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

/**
 * Find a test user by email
 */
export function findTestUserByEmail(email: string): TestUser | undefined {
  return testUsers.find(user => user.email === email);
}

/**
 * Find a test user by UID
 */
export function findTestUserByUid(uid: string): TestUser | undefined {
  return testUsers.find(user => user.uid === uid);
}

/**
 * Generate a JWT token for a test user (mock version)
 */
export function generateTestToken(user: User): string {
  // In a real app, this would be a proper JWT
  return Buffer.from(JSON.stringify({
    uid: user.uid,
    email: user.email,
    role: user.role,
    exp: Date.now() + 3600000 // 1 hour from now
  })).toString('base64');
}

/**
 * Convert a TestUser to a regular User (without password)
 */
export function stripSensitiveData(user: TestUser): User {
  // Destructure to remove password
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Authenticate a test user with email and password
 * 
 * @returns User information without sensitive data if authentication is successful
 */
export function authenticateTestUser(email: string, password: string): User | null {
  const user = findTestUserByEmail(email);
  
  // Check if user exists and password matches
  if (user && user.password === password) {
    // Update last login
    user.lastLogin = new Date();
    
    // Return user without the password
    return stripSensitiveData(user);
  }
  
  return null;
}