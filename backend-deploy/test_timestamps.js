const { pool } = require('./config/database');

async function testTimestamps() {
  try {
    console.log('Testing timestamp handling...\n');
    
    // Check current timezone settings
    console.log('=== Server Settings ===');
    console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('Current UTC time:', new Date().toISOString());
    console.log('Current IST time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
    // Check database timezone
    const dbTimezone = await pool.query('SHOW timezone');
    console.log('Database timezone:', dbTimezone.rows[0].TimeZone);
    
    console.log('\n=== Recent Messages ===');
    
    // Get recent messages with proper timezone conversion
    const result = await pool.query(`
      SELECT 
        id, 
        sender_id, 
        receiver_id, 
        content,
        created_at,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at_ist
      FROM messages 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    result.rows.forEach(msg => {
      console.log(`\nMessage ID: ${msg.id}`);
      console.log(`Content: ${msg.content.substring(0, 30)}...`);
      console.log(`Stored timestamp: ${msg.created_at}`);
      console.log(`IST timestamp: ${msg.created_at_ist}`);
      console.log(`JavaScript Date: ${new Date(msg.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    });
    
    console.log('\n=== Testing New Message Creation ===');
    
    // Simulate creating a new message (without actually inserting)
    const now = new Date();
    console.log('Current time (ISO):', now.toISOString());
    console.log('Current time (IST):', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
    // Test how PostgreSQL would handle NOW()
    const pgNow = await pool.query('SELECT NOW() as current_timestamp');
    console.log('PostgreSQL NOW():', pgNow.rows[0].current_timestamp);
    console.log('PostgreSQL NOW() in IST:', new Date(pgNow.rows[0].current_timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
  } catch (error) {
    console.error('Error testing timestamps:', error);
  } finally {
    pool.end();
  }
}

testTimestamps();
