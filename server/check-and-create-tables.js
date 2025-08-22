const { pool } = require('./config/database');

async function checkAndCreateTables() {
  console.log('🔍 Checking existing tables in Railway PostgreSQL...\n');
  
  try {
    // Check which tables exist
    const existingTablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const existingTables = existingTablesResult.rows.map(row => row.table_name);
    console.log('📋 Existing tables:', existingTables);
    
    const requiredTables = ['users', 'projects', 'project_members', 'messages'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables already exist!');
      return;
    }
    
    console.log('❌ Missing tables:', missingTables);
    console.log('\n🚀 Creating missing tables...\n');

    // Enable UUID extension first
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Create users table if missing
    if (missingTables.includes('users')) {
      await pool.query(`
        CREATE TABLE users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          university VARCHAR(100) DEFAULT 'Amravati University',
          department VARCHAR(100),
          year INTEGER,
          skills TEXT[],
          interests TEXT[],
          bio TEXT,
          profile_image VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      console.log('✅ Users table created');
    } else {
      console.log('ℹ️  Users table already exists');
    }

    // Create projects table if missing
    if (missingTables.includes('projects')) {
      await pool.query(`
        CREATE TABLE projects (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(50) NOT NULL CHECK (category IN ('Web Development', 'Mobile App', 'AI/ML', 'Research', 'Other')),
          tech_stack TEXT[],
          required_skills TEXT[],
          team_size_current INTEGER DEFAULT 1,
          team_size_required INTEGER NOT NULL,
          owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed', 'Cancelled')),
          deadline TIMESTAMP WITH TIME ZONE,
          is_hackathon BOOLEAN DEFAULT FALSE,
          hackathon_name VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      console.log('✅ Projects table created');
    } else {
      console.log('ℹ️  Projects table already exists');
    }

    // Create project_members table if missing
    if (missingTables.includes('project_members')) {
      await pool.query(`
        CREATE TABLE project_members (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'Member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `);
      console.log('✅ Project_members table created');
    } else {
      console.log('ℹ️  Project_members table already exists');
    }

    // Create messages table if missing
    if (missingTables.includes('messages')) {
      await pool.query(`
        CREATE TABLE messages (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
          sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      console.log('✅ Messages table created');
    } else {
      console.log('ℹ️  Messages table already exists');
    }

    // Create indexes
    console.log('\n🔧 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id)',
      'CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)',
      'CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)',
      'CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id)',
      'CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id)'
    ];
    
    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }
    console.log('✅ Indexes created');

    // Create update function and triggers
    console.log('\n⚙️  Creating triggers...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
          CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
          CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$
    `);
    console.log('✅ Triggers created');

    // Final check
    console.log('\n🔍 Final verification...');
    const finalTablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const finalTables = finalTablesResult.rows.map(row => row.table_name);
    console.log('📋 All tables now:', finalTables);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('✅ Required tables: users, projects, project_members, messages');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the check and setup
checkAndCreateTables();
