const { pool } = require('./config/database');

async function createTables() {
  console.log('🚀 Starting database table creation...');
  
  try {
    // Enable UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
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

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
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

    // Create project_members table
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
    console.log('✅ Project members table created');

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Messages table created');

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id)');
    console.log('✅ Indexes created');

    // Create update function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Create triggers
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

    console.log('🎉 All database tables created successfully!');
    console.log('📊 Tables created: users, projects, project_members, messages');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

// Run the setup
createTables().then(() => {
  console.log('✅ Database setup completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
