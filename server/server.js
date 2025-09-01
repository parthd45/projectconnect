const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['https://projectconnect.tech', 'https://project-connect-h3xrtzlt8-parthd4567-gmailcoms-projects.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory user storage (for demo purposes)
const users = [];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProjectConnect API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API endpoint working', 
    status: 'success',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/signin', '/api/signup'],
      general: ['/api/health', '/api/users']
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Authentication endpoints
app.post('/api/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
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
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
});

app.post('/api/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Signin successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token: 'demo_token_' + user.id // In production, use proper JWT
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during signin',
      error: error.message
    });
  }
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    users: users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }))
  });
});

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}
