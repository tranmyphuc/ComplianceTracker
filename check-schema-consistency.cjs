/**
 * Script to check for inconsistencies between the database schema and Drizzle schema definitions
 */
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const dotenv = require('dotenv');
const schema = require('./shared/schema');

dotenv.config();

async function checkSchemaConsistency() {
  try {
    console.log('Starting schema consistency check...');
    
    // Connect to the database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const queryClient = postgres(connectionString);
    const db = drizzle(queryClient);
    
    console.log('Connected to database');
    
    // Get table information from the database
    const tableInfoQuery = `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name, ordinal_position;
    `;
    
    const tableInfo = await queryClient.unsafe(tableInfoQuery);
    console.log(`Found ${tableInfo.length} columns across all tables`);
    
    // Group by table name for easier processing
    const dbTables = {};
    for (const row of tableInfo) {
      const { table_name, column_name, data_type, is_nullable, column_default } = row;
      
      if (!dbTables[table_name]) {
        dbTables[table_name] = [];
      }
      
      dbTables[table_name].push({
        name: column_name,
        type: data_type,
        isNullable: is_nullable === 'YES',
        default: column_default
      });
    }
    
    // Extract table definitions from Drizzle schema
    const schemaTables = {};
    for (const [key, value] of Object.entries(schema)) {
      // Check if it's a table definition
      if (value && typeof value === 'object' && value._.name) {
        schemaTables[value._.name] = {
          name: value._.name,
          columns: Object.entries(value).filter(([k]) => k !== '_').map(([colName, colDef]) => ({
            name: colDef.name,
            jsName: colName
          }))
        };
      }
    }
    
    // Check for table mismatches
    console.log('\n=== Database vs Schema Tables ===');
    const dbTableNames = Object.keys(dbTables);
    const schemaTableNames = Object.keys(schemaTables);
    
    const missingInSchema = dbTableNames.filter(name => !schemaTableNames.includes(name));
    const missingInDb = schemaTableNames.filter(name => !dbTableNames.includes(name));
    
    if (missingInSchema.length) {
      console.log('\nTables in database but missing in schema:');
      missingInSchema.forEach(name => console.log(`- ${name}`));
    } else {
      console.log('\nAll database tables are defined in the schema.');
    }
    
    if (missingInDb.length) {
      console.log('\nTables in schema but missing in database:');
      missingInDb.forEach(name => console.log(`- ${name}`));
    } else {
      console.log('\nAll schema tables exist in the database.');
    }
    
    // Check for column mismatches in each table
    console.log('\n=== Column Mismatches ===');
    let inconsistencies = [];
    
    for (const tableName of dbTableNames.filter(name => schemaTableNames.includes(name))) {
      const dbColumns = dbTables[tableName].map(col => col.name);
      const schemaColumns = schemaTables[tableName].columns.map(col => col.name);
      
      const missingInSchema = dbColumns.filter(name => !schemaColumns.includes(name));
      const missingInDb = schemaColumns.filter(name => !dbColumns.includes(name));
      
      if (missingInSchema.length || missingInDb.length) {
        console.log(`\nTable: ${tableName}`);
        
        if (missingInSchema.length) {
          console.log('  Columns in database but missing in schema:');
          missingInSchema.forEach(colName => {
            console.log(`  - ${colName}`);
            inconsistencies.push({
              table: tableName,
              column: colName,
              issue: 'missing_in_schema'
            });
          });
        }
        
        if (missingInDb.length) {
          console.log('  Columns in schema but missing in database:');
          missingInDb.forEach(colName => {
            console.log(`  - ${colName}`);
            inconsistencies.push({
              table: tableName,
              column: colName,
              issue: 'missing_in_db'
            });
          });
        }
      }
    }
    
    // Generate recommendations
    if (inconsistencies.length) {
      console.log('\n=== Recommendations ===');
      
      const missingInDbIssues = inconsistencies.filter(i => i.issue === 'missing_in_db');
      if (missingInDbIssues.length) {
        console.log('\nCreate migration to add missing columns to database:');
        console.log('```sql');
        
        let currentTable = '';
        for (const issue of missingInDbIssues) {
          if (currentTable !== issue.table) {
            if (currentTable) console.log(';');
            console.log(`\n-- Add missing columns to ${issue.table}`);
            console.log(`ALTER TABLE ${issue.table}`);
            currentTable = issue.table;
          } else {
            console.log(',');
          }
          
          console.log(`  ADD COLUMN IF NOT EXISTS ${issue.column} text`);
        }
        console.log(';');
        console.log('```');
      }
      
      const missingInSchemaIssues = inconsistencies.filter(i => i.issue === 'missing_in_schema');
      if (missingInSchemaIssues.length) {
        console.log('\nUpdate schema.ts to include these columns:');
        
        let currentTable = '';
        for (const issue of missingInSchemaIssues) {
          if (currentTable !== issue.table) {
            console.log(`\n// Add to ${issue.table} table definition in schema.ts`);
            currentTable = issue.table;
          }
          
          console.log(`${issue.column}: text('${issue.column}'),`);
        }
      }
    } else {
      console.log('\nNo inconsistencies found. Schema matches database structure!');
    }
    
    // Close the connection
    await queryClient.end();
    console.log('\nDatabase connection closed');
    
    return {
      success: true,
      inconsistencies,
      message: inconsistencies.length ? 
        `Found ${inconsistencies.length} schema inconsistencies` : 
        'No schema inconsistencies found'
    };
  } catch (error) {
    console.error('Error checking schema consistency:', error);
    return { success: false, error };
  }
}

checkSchemaConsistency()
  .then(result => {
    if (result.success) {
      console.log(`\n${result.message}`);
      process.exit(0);
    } else {
      console.error('Script failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });