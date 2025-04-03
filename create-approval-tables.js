/**
 * Script to create approval workflow tables
 */
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Create database connection
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function createApprovalTables() {
  try {
    console.log('Creating approval workflow tables...');

    // Create approval_items table
    await sql`
      CREATE TABLE IF NOT EXISTS approval_items (
        id SERIAL PRIMARY KEY,
        item_id TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        module_type TEXT NOT NULL,
        content_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT NOW(),
        created_by TEXT REFERENCES users(uid),
        updated_at TIMESTAMP
      );
    `;
    console.log('✅ Created approval_items table');

    // Create approval_assignments table
    await sql`
      CREATE TABLE IF NOT EXISTS approval_assignments (
        id SERIAL PRIMARY KEY,
        assignment_id TEXT NOT NULL UNIQUE,
        item_id TEXT REFERENCES approval_items(item_id),
        assigned_to TEXT REFERENCES users(uid),
        assigned_by TEXT REFERENCES users(uid),
        assigned_at TIMESTAMP DEFAULT NOW(),
        due_date TIMESTAMP,
        status TEXT DEFAULT 'pending',
        notes TEXT
      );
    `;
    console.log('✅ Created approval_assignments table');

    // Create approval_history table
    await sql`
      CREATE TABLE IF NOT EXISTS approval_history (
        id SERIAL PRIMARY KEY,
        history_id TEXT NOT NULL UNIQUE,
        item_id TEXT REFERENCES approval_items(item_id),
        action TEXT NOT NULL,
        action_by TEXT REFERENCES users(uid),
        action_at TIMESTAMP DEFAULT NOW(),
        comments TEXT,
        previous_status TEXT,
        new_status TEXT
      );
    `;
    console.log('✅ Created approval_history table');

    // Create approval_notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS approval_notifications (
        id SERIAL PRIMARY KEY,
        notification_id TEXT NOT NULL UNIQUE,
        user_id TEXT REFERENCES users(uid),
        item_id TEXT REFERENCES approval_items(item_id),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Created approval_notifications table');

    // Create approval_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS approval_settings (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(uid) UNIQUE,
        notification_frequency TEXT DEFAULT 'immediate',
        email_notifications BOOLEAN DEFAULT TRUE,
        assignment_alerts BOOLEAN DEFAULT TRUE,
        status_change_alerts BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP
      );
    `;
    console.log('✅ Created approval_settings table');

    console.log('✅ All approval workflow tables created successfully');
  } catch (error) {
    console.error('Error creating approval workflow tables:', error);
  } finally {
    await sql.end();
  }
}

// Run the script
createApprovalTables();