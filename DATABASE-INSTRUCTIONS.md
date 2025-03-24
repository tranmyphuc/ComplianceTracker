# Database Migration Instructions for Deployment

This document contains instructions on how to migrate your database when deploying this application.

## Overview

When you deploy this application to a fresh environment, you'll need to:

1. Export your existing database from the development environment
2. Import that database into the production environment

## Exporting the Database

Before deploying, run the following command in your development environment:

```bash
node export-database.js
```

This will:
1. Create a backup file in the `db-exports` directory called `latest.sql`
2. Show statistics about your database tables and their sizes

## Importing the Database in Production

After deploying to a new environment, you have two options:

### Option 1: Interactive Import (Development or Manual Deployment)

Run the following command to import your data with an interactive prompt:

```bash
node import-database.js
```

This will:
1. Check if your database is accessible
2. Check if there are existing tables
3. Ask if you want to drop existing tables (if any)
4. Import your data from the exported SQL file

### Option 2: Automatic Import (For Deployments)

For automatic deployment without prompts, use this command:

```bash
node deploy-import-database.js
```

This will:
1. Check if your database is accessible
2. Automatically drop all existing tables
3. Import your data from the exported SQL file
4. Show table statistics after import

## Important Notes

- Make sure your production environment has the `DATABASE_URL` environment variable set correctly
- The `deploy-import-database.js` script doesn't ask for confirmation before dropping tables
- Always keep a backup of your database exports for safety
- Include database export & import in your deployment workflow

## Troubleshooting

If you encounter any issues:

- Check that your export file exists in the `db-exports` directory
- Verify that PostgreSQL is installed and running in your production environment
- Ensure you have the correct DATABASE_URL in your environment variables
- Check the permissions on the db-exports directory and files

## File Locations

- Export script: `export-database.js`
- Interactive import script: `import-database.js`
- Automatic deployment import script: `deploy-import-database.js`
- Database exports directory: `db-exports/` 
- Latest database export: `db-exports/latest.sql`