// In-memory user storage
let users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, college, skills, interests, bio, github_link } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In production, hash this password
      college,
      skills,
      interests,
      bio,
      github_link,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          college: newUser.college,
          createdAt: newUser.createdAt
        },
        token: 'demo_token_' + newUser.id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
}
