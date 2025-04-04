/**
 * Simple script to check the activities table structure
 */
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

async function checkActivitiesTable() {
  try {
    console.log('Checking activities table structure...');
    
    // Connect to the database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const sql = postgres(connectionString);
    
    // Get activities table columns
    const columnsQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public' AND 
        table_name = 'activities'
      ORDER BY 
        ordinal_position;
    `;
    
    const columns = await sql.unsafe(columnsQuery);
    
    console.log('\nActivities Table Structure:');
    console.log('==========================');
    
    columns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check for specific columns we're interested in
    const expectedColumns = [
      'activity_type',
      'target_id',
      'target_type',
      'details',
      'ip',
      'type',
      'system_id',
      'metadata'
    ];
    
    console.log('\nExpected Columns Check:');
    console.log('=======================');
    
    const existingColumns = columns.map(c => c.column_name);
    
    expectedColumns.forEach(colName => {
      const exists = existingColumns.includes(colName);
      console.log(`- ${colName}: ${exists ? 'PRESENT' : 'MISSING'}`);
    });
    
    // Close the connection
    await sql.end();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error checking activities table:', error);
  }
}

checkActivitiesTable().catch(console.error);