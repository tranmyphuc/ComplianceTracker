import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString as string);

// Create a Drizzle instance
export const db = drizzle(client, { schema });