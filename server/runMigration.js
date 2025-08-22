const { pool } = require('./config/database');
const fs = require('fs');

async function runMigration() {
  try {
    console.log('🔄 Running password reset migration...');
    const sql = fs.readFileSync('./migrations/add_password_reset_tokens.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Migration completed: Added password reset token columns');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Columns already exist, migration skipped');
      await pool.end();
      process.exit(0);
    } else {
      await pool.end();
      process.exit(1);
    }
  }
}

runMigration();
