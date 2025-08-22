# Database Setup Guide

## Option 1: PostgreSQL Local Installation (Recommended for Development)

### Windows Installation:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (version 14+ recommended)
3. During installation:
   - Set password for 'postgres' user (remember this!)
   - Use default port 5432
   - Leave other settings as default

### Setup Database:
1. Open pgAdmin (installed with PostgreSQL)
2. Connect using the password you set
3. Create a new database called `projectconnect`

### Update Environment:
1. Open `.env` file in the server folder
2. Update the database URL:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/projectconnect
   ```

## Option 2: Quick SQLite Setup (For Testing Only)

If you want to test quickly without PostgreSQL:

1. Install SQLite dependency:
   ```bash
   cd server
   npm install sqlite3
   ```

2. Update `server/database/db.js` to use SQLite:
   ```javascript
   // Replace PostgreSQL config with:
   const sqlite3 = require('sqlite3').verbose();
   const db = new sqlite3.Database('./projectconnect.db');
   ```

## Option 3: Online Database (Heroku Postgres)

1. Create free Heroku account
2. Add Heroku Postgres addon
3. Copy database URL to `.env` file

## Verify Database Connection

Run this command in the server directory:
```bash
npm run dev
```

You should see: "Connected to PostgreSQL database"

If you see connection errors, check:
- PostgreSQL is running
- Database name is correct
- Username/password are correct
- Port 5432 is not blocked

## Database Tables

The application will automatically create these tables:
- users (profiles, authentication)
- projects (project listings)
- project_connections (collaboration requests)
- messages (user communication)
