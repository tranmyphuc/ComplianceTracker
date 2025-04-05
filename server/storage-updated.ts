import { users, type User, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private nextUserId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      createdAt: new Date(),
      lastLogin: null,
    };
    this.users.push(user);
    return user;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

// Use database storage by default, fall back to memory storage if needed
let storage: IStorage;

try {
  // Try to create a database connection
  storage = new DatabaseStorage();
  console.log("Using DatabaseStorage for data persistence");
} catch (error) {
  console.warn("Failed to initialize database storage, falling back to MemStorage:", error);
  storage = new MemStorage();
}

export { storage };