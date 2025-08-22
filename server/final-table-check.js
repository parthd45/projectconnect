const { pool } = require('./config/database');

async function checkAllTablesAndFix() {
  console.log('🔍 Checking ALL table structures...\n');
  
  try {
    // Check users table structure
    const usersStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 USERS table structure:');
    usersStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check projects table structure
    const projectsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 PROJECTS table structure:');
    projectsStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check messages table structure
    const messagesStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 MESSAGES table structure:');
    messagesStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Get ID types
    const usersIdType = usersStructure.rows.find(row => row.column_name === 'id')?.data_type;
    const projectsIdType = projectsStructure.rows.find(row => row.column_name === 'id')?.data_type;
    
    console.log(`\n🔍 Users ID type: ${usersIdType}`);
    console.log(`🔍 Projects ID type: ${projectsIdType}`);
    
    // Create project_members table with compatible types
    console.log('\n🔧 Creating project_members table with compatible data types...');
    
    let projectMembersQuery;
    if (usersIdType === 'integer' && projectsIdType === 'integer') {
      projectMembersQuery = `
        CREATE TABLE IF NOT EXISTS project_members (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `;
    } else if (usersIdType === 'uuid' && projectsIdType === 'integer') {
      projectMembersQuery = `
        CREATE TABLE IF NOT EXISTS project_members (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `;
    } else {
      // Both UUID or other combinations
      projectMembersQuery = `
        CREATE TABLE IF NOT EXISTS project_members (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `;
    }
    
    await pool.query(projectMembersQuery);
    console.log('✅ Project_members table created successfully!');
    
    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id)');
    console.log('✅ Indexes created');
    
    // Final check
    console.log('\n🔍 Final verification - All tables:');
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    allTables.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📋 Required tables for ProjectConnect: ✅ users, ✅ projects, ✅ project_members, ✅ messages');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkAllTablesAndFix();
