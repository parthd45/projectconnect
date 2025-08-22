const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
require('dotenv').config();

// Set timezone to Asia/Kolkata
process.env.TZ = 'Asia/Kolkata';

// Import database connection
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const projectRequestRoutes = require('./routes/projectRequests');
const dashboardRoutes = require('./routes/dashboard');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting ProjectConnect Backend Server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Port:', PORT);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://projectconnect.tech',
        'https://www.projectconnect.tech',
        'https://projectconnect-frontend-parthd-2025.azurewebsites.net',
        process.env.CLIENT_URL
      ] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Remove frontend serving since frontend is deployed separately to Azure Static Web Apps
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from the React app build directory
//   app.use(express.static(path.join(__dirname, 'client')));
// }

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_session_secret_for_development',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Create a copy of the request body without sensitive fields
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[HIDDEN]';
    }
    if (sanitizedBody.confirmPassword) {
      sanitizedBody.confirmPassword = '[HIDDEN]';
    }
    console.log('Request body:', JSON.stringify(sanitizedBody, null, 2));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ProjectConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - API info only (frontend deployed separately)
app.get('/', (req, res) => {
  // Backend API info
  res.json({ 
    message: 'ProjectConnect API',
    version: '1.0.1',
    status: 'running',
    timestamp: new Date().toISOString(),
    frontend: 'Deployed separately to Azure Static Web Apps'
  });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    await testConnection();
    res.json({ 
      message: 'Database connection successful!',
      database: 'PostgreSQL',
      status: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic endpoint to test CORS
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS test successful', origin: req.headers.origin });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - serve React app for non-API routes, API error for /api routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    // API route not found
    res.status(404).json({ message: 'API endpoint not found' });
  } else {
    // Non-API route - frontend is deployed separately
    res.status(404).json({ 
      message: 'Route not found', 
      note: 'Frontend is deployed separately to Azure Static Web Apps' 
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🎯 Status: Backend is LIVE and ready!`);
  
  // Test database connection (don't let it prevent server startup)
  try {
    await testConnection();
  } catch (error) {
    console.error('❌ Database connection failed - server will continue without database:', error.message);
  }
});

module.exports = app;
