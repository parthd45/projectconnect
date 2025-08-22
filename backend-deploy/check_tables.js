const { pool } = require('./config/database');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Existing tables:');
    result.rows.forEach(row => console.log(' -', row.table_name));
    
    // Check if project_requests table exists
    const hasProjectRequests = result.rows.some(row => row.table_name === 'project_requests');
    
    if (!hasProjectRequests) {
      console.log('\nCreating project_requests table...');
      await pool.query(`
        CREATE TABLE project_requests (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
          message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(project_id, user_id)
        );
      `);
      console.log('✅ project_requests table created');
    }
    
    // Check messages table structure
    const messageColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'messages' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nMessages table structure:');
    messageColumns.rows.forEach(row => {
      console.log(` - ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkTables();
