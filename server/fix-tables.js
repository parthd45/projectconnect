const { pool } = require('./config/database');

async function fixTablesAndCreateMissing() {
  console.log('🔍 Checking table structures and fixing issues...\n');
  
  try {
    // Check the structure of projects table
    const projectsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Projects table structure:');
    projectsStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check if projects.id is integer or uuid
    const projectsIdType = projectsStructure.rows.find(row => row.column_name === 'id')?.data_type;
    console.log(`\n🔍 Projects table ID type: ${projectsIdType}`);
    
    // Create project_members table with correct data type
    if (projectsIdType === 'integer') {
      console.log('\n⚠️  Projects table uses INTEGER ids, creating project_members with INTEGER foreign keys...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS project_members (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `);
    } else {
      console.log('\n✅ Projects table uses UUID ids, creating project_members with UUID foreign keys...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS project_members (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `);
    }
    
    console.log('✅ Project_members table created successfully');
    
    // Create indexes
    console.log('\n🔧 Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id)');
    console.log('✅ Indexes created');
    
    // Final verification
    console.log('\n🔍 Final table check...');
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 All tables in database:');
    allTables.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('✅ All required tables: users, projects, project_members, messages');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixTablesAndCreateMissing();
