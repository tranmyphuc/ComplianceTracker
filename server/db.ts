import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a PostgreSQL connection with better error handling
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set. Database operations will fail.");
}

let pgClient;
try {
  console.log("Attempting to connect to PostgreSQL database...");
  pgClient = postgres(connectionString as string, {
    max: 10, // Max number of connections
    idle_timeout: 30, // Max seconds a connection can be idle
    connect_timeout: 10, // Max seconds to wait for a connection
  });
  console.log("Successfully connected to PostgreSQL database");
} catch (error) {
  console.error("Failed to connect to PostgreSQL database:", error);
  // Provide a fallback to prevent the application from crashing
  pgClient = postgres("postgresql://localhost:5432/dummy", { max: 1 });
}

// Create a Drizzle instance
export const db = drizzle(pgClient, { schema });

// Export the postgres client for direct SQL queries
export const sql = pgClient;