const { pool } = require('./config/database');
const fs = require('fs');

async function runMigration() {
  try {
    console.log('Running timestamp migration...');
    
    const migration = fs.readFileSync('./migrations/fix_message_timestamps.sql', 'utf8');
    await pool.query(migration);
    
    console.log('✅ Migration completed successfully');
    
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'created_at'
    `);
    
    console.log('Updated column info:', result.rows);
    
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    pool.end();
  }
}

runMigration();
