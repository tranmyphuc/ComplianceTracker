/**
 * Authentication routes for test users
 */
import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { authenticateTestUser, generateTestToken, findTestUserByEmail, findTestUserByUid, testUsers } from "../test-users";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../middleware/auth-middleware";

const router = Router();

// Validate login request
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Validate registration request
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().optional(),
  department: z.string().optional(),
  role: z.enum(["user", "admin", "operator", "developer", "decision_maker"] as const).optional()
});

/**
 * Get current user
 */
router.get("/me", async (req: Request, res: Response) => {
  try {
    // Check if user is in session
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Return user info
    return res.json(req.user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return res.status(500).json({ message: "Error getting user information" });
  }
});

/**
 * Test user login
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validate request
    const data = loginSchema.parse(req.body);
    
    // Development mode bypass for admin account
    if (process.env.NODE_ENV === "development" && data.email === "bypass") {
      const adminUser = testUsers[0]; // Admin user
      const token = generateTestToken(adminUser);
      
      // Set user in session
      if (req.session) {
        req.session.user = adminUser;
        req.session.token = token;
      }
      
      return res.json({
        ...adminUser,
        token
      });
    }
    
    // Authenticate user
    const user = authenticateTestUser(data.email, data.password);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Generate token
    const token = generateTestToken(user);
    
    // Set user in session
    if (req.session) {
      req.session.user = user;
      req.session.token = token;
    }
    
    // Return user with token
    return res.json({
      ...user,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid login data", 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ message: "Error during login" });
  }
});

/**
 * Register a new test user (in development mode only)
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Only allow registration in development mode
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Registration is disabled in production mode" });
    }
    
    // Validate request
    const data = registerSchema.parse(req.body);
    
    // Check if email already exists
    const existingUser = findTestUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Create user in database
    try {
      // Use imported UserRole type

      // First handle the password separately (would be hashed in a real app)
      const userPassword = data.password;
      
      // Create user with proper schema fields
      const newUser = await storage.createUser({
        uid: uuidv4(),
        username: data.username,
        email: data.email,
        displayName: data.displayName,
        department: data.department,
        role: (data.role as UserRole) || "user"
      });
      
      // Generate token
      const token = generateTestToken(newUser);
      
      // Set user in session
      if (req.session) {
        req.session.user = newUser;
        req.session.token = token;
      }
      
      return res.status(201).json({
        ...newUser,
        token
      });
    } catch (dbError) {
      console.error("Database error during registration:", dbError);
      return res.status(500).json({ message: "Error creating user account" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid registration data", 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ message: "Error during registration" });
  }
});

/**
 * Logout user
 */
router.post("/logout", (req: Request, res: Response) => {
  // Clear user from session
  if (req.session) {
    delete req.session.user;
    delete req.session.token;
  }
  
  return res.json({ message: "Logged out successfully" });
});

/**
 * Get all test users (development mode only)
 */
router.get("/test-users", (req: Request, res: Response) => {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ message: "This endpoint is only available in development mode" });
  }
  
  // Return list of test users (without passwords)
  const users = testUsers.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  return res.json(users);
});

export default router;