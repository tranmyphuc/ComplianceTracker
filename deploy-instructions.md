# Deployment Instructions for SGH ASIA EU AI Act Compliance Platform

## Before Deployment

1. Export your database by running:
   ```
   node export-database.js
   ```

2. Verify that the export was created:
   ```
   ls -la db-exports/
   ```
   You should see a `latest.sql` file and dated export files.

## Deployment Process

### Step 1: Deploy via Replit

Click the "Deploy" button in Replit to create your deployment.

### Step 2: Transfer Database Export to Deployment

Since Replit deployment doesn't automatically include your database export files, we've created multiple methods to transfer your data:

#### Option A: Using the Inline Import Script (Easiest)

1. In your development environment, run:
   ```
   node get-sql-content.js
   ```

2. Copy the entire SQL content that's displayed

3. In your deployed Repl, edit the `inline-import.js` file:
   - Replace the placeholder SQL content with your copied SQL

4. Run the inline import script:
   ```
   node inline-import.js
   ```

#### Option B: Upload via Replit UI

1. In your deployed Repl, create a `db-exports` directory if it doesn't exist
2. Upload your local `db-exports/latest.sql` file to this directory
3. Run the import script in the deployed environment:
   ```
   node deploy-import-database.js
   ```

#### Option C: Direct SQL File Creation

1. In your development environment, view the contents of your export:
   ```
   cat db-exports/latest.sql
   ```
2. Copy the entire SQL content
3. In your deployed Repl, create a new file at `db-exports/latest.sql` and paste the SQL content
4. Run the import script in the deployed environment:
   ```
   node deploy-import-database.js
   ```

## Verifying Deployment

After importing your database, verify that:

1. The AI systems inventory shows all your systems
2. Risk assessments are properly loaded
3. Training modules and progress are available

## Troubleshooting

If you encounter issues:

1. Check the console output of the import script for errors
2. Verify that your `DATABASE_URL` environment variable is properly set in the deployed environment
3. Make sure all required API keys are set in your deployment environment
4. If needed, check database connectivity with:
   ```
   psql $DATABASE_URL -c "SELECT count(*) FROM ai_systems"
   ```

## Important Notes

- Always back up your database before deploying
- The import script will drop all existing tables in your production database
- All data in your production database will be replaced with data from your export

## Files Used For Deployment

- `export-database.js` - Exports your database to SQL files
- `deploy-import-database.js` - Automatic import for deployment (requires SQL file)
- `inline-import.js` - Import with embedded SQL (easiest for deployment)
- `get-sql-content.js` - Helper to get SQL content for easy copying
- `deploy-instructions.md` - This documentation file