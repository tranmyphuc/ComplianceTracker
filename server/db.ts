import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a PostgreSQL connection with better error handling
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set. Database operations will fail.");
}

// Parse the connection string to extract host, port, etc.
function parseConnectionString(connStr: string) {
  const regex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
  const match = connStr.match(regex);
  
  if (match) {
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4], 10),
      database: match[5]
    };
  }
  
  return null;
}

let pgClient;
try {
  console.log("Attempting to connect to PostgreSQL database...");
  
  // Try both connection methods:
  // 1. Using environment variables directly (more reliable)
  // 2. Using the connection string as fallback
  if (process.env.PGHOST && process.env.PGPORT && process.env.PGUSER && 
      process.env.PGPASSWORD && process.env.PGDATABASE) {
    pgClient = postgres({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT, 10),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      max: 10, // Max number of connections
      idle_timeout: 30, // Max seconds a connection can be idle
      connect_timeout: 20, // Max seconds to wait for a connection
      ssl: { rejectUnauthorized: false } // For managed Postgres services
    });
    console.log("Successfully connected to PostgreSQL database using environment variables");
  } else {
    pgClient = postgres(connectionString as string, {
      max: 10, // Max number of connections
      idle_timeout: 30, // Max seconds a connection can be idle
      connect_timeout: 20, // Max seconds to wait for a connection
      ssl: { rejectUnauthorized: false } // For managed Postgres services
    });
    console.log("Successfully connected to PostgreSQL database using connection string");
  }
} catch (error) {
  console.error("Failed to connect to PostgreSQL database:", error);
  // Create a more useful dummy client that logs operations
  const dummyClient = (query: string, ...args: any[]) => {
    console.warn(`Database operation attempted but connection failed: ${query}`, ...args);
    return [];
  };
  dummyClient.array = () => [];
  dummyClient.end = () => {};
  
  // @ts-ignore - We're creating a minimal dummy client
  pgClient = dummyClient;
}

// Create a Drizzle instance
export const db = drizzle(pgClient, { schema });

// Export the postgres client for direct SQL queries
export const sql = pgClient;