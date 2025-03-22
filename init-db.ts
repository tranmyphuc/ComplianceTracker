import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./shared/schema";
import { departments, users, aiSystems, activities, alerts, deadlines } from "./shared/schema";

// Create a PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString as string);

// Create a Drizzle instance
const db = drizzle(client, { schema });

async function initializeDatabase() {
  console.log("Initializing database with sample data...");
  
  try {
    // Check if departments already exist
    const deptCount = await db.select({ count: sql`COUNT(*)::int` }).from(departments);
    if (deptCount[0].count > 0) {
      console.log("Departments already exist, skipping initialization");
      return;
    }

    // Initialize departments
    const departmentData = [
      { name: "Engineering", complianceScore: 87 },
      { name: "Marketing", complianceScore: 65 },
      { name: "Human Resources", complianceScore: 92 },
      { name: "Customer Service", complianceScore: 78 },
      { name: "Finance", complianceScore: 56 },
      { name: "Executive", complianceScore: 90 },
      { name: "Information Technology", complianceScore: 95 },
      { name: "Research & Development", complianceScore: 82 }
    ];
    
    console.log("Adding departments...");
    await db.insert(departments).values(departmentData);
    
    // Initialize admin user if none exists
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    if (userCount[0].count === 0) {
      console.log("Creating default admin user...");
      try {
        await db.insert(users).values({
          uid: "admin-01",
          username: "admin",
          email: "admin@sghasia.com",
          password: "password123", // In a real app, this would be properly hashed
          display_name: "Admin User", // Note: This field is display_name in the database
          role: "admin",
          department: "Executive"
        });
        console.log("Admin user created successfully!");
      } catch (error) {
        console.error("Error creating admin user:", error);
      }
    }
    
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Import the SQL function for count
import { sql } from "drizzle-orm";

// Run the initialization
initializeDatabase();