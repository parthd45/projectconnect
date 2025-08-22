const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available, otherwise use individual environment variables
const databaseConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  timezone: '+05:30' // IST timezone
} : {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('rlwy.net') ? { rejectUnauthorized: false } : false,
  timezone: '+05:30' // IST timezone
};

const pool = new Pool(databaseConfig);

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

// Helper function to test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🎯 Database connection test successful:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Database connection test failed:', err);
  }
};

module.exports = { pool, testConnection };
