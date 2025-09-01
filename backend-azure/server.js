const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    'https://projectconnect.tech',
    'https://www.projectconnect.tech',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for demo
let users = [];
let nextUserId = 1;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect Backend API is running on Azure!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'Azure App Service'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'ProjectConnect API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      name,
      email,
      password, // In production, hash this
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: `mock_jwt_token_${newUser.id}`
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
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

    // Return success without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: `mock_jwt_token_${user.id}`
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// OAuth endpoints (placeholders)
app.post('/api/auth/google', (req, res) => {
  res.json({
    success: false,
    message: 'Google OAuth is not yet configured. Please use email/password authentication for now.',
    type: 'oauth_not_configured'
  });
});

app.post('/api/auth/github', (req, res) => {
  res.json({
    success: false,
    message: 'GitHub OAuth is not yet configured. Please use email/password authentication for now.',
    type: 'oauth_not_configured'
  });
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to your dashboard!',
    data: {
      totalProjects: 5,
      activeConnections: 12,
      recentActivity: [
        { action: 'Project created', time: '2 hours ago' },
        { action: 'Connection established', time: '5 hours ago' }
      ]
    }
  });
});

// Users list (for testing)
app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    users: usersWithoutPasswords,
    total: users.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/google',
      'POST /api/auth/github',
      'GET /api/dashboard',
      'GET /api/users'
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 ProjectConnect Backend running on port ${port}`);
  console.log(`📍 Environment: Azure App Service`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
