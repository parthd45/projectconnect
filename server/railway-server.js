const express = require('express');
const cors = require('cors');

const app = express();

// Get port from environment
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting ProjectConnect API on Railway...');
console.log(`📍 Port: ${PORT}`);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'https://projectconnect.tech',
    'https://yellow-river-0686b2500.azurestaticapps.net',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/', (req, res) => {
  console.log('📋 Health check requested');
  res.status(200).json({
    message: 'ProjectConnect API - Railway Deployment',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'Railway',
    version: '2.0.0',
    success: true
  });
});

// API health endpoint  
app.get('/api/health', (req, res) => {
  console.log('🏥 API health check requested');
  res.status(200).json({
    status: 'healthy',
    api: 'working',
    timestamp: new Date().toISOString(),
    platform: 'Railway',
    success: true
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.status(200).json({
    message: 'Backend is working perfectly on Railway!',
    success: true,
    version: '2.0.0',
    backend: 'Railway',
    frontend: 'projectconnect.tech',
    deployment: 'success'
  });
});

// Projects endpoint (placeholder)
app.get('/api/projects', (req, res) => {
  console.log('📁 Projects endpoint requested');
  res.status(200).json({
    projects: [],
    message: 'Projects endpoint ready',
    count: 0,
    success: true
  });
});

// Catch all API routes
app.get('/api/*', (req, res) => {
  console.log(`🔍 API route requested: ${req.path}`);
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    message: 'This API endpoint is not implemented yet'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ProjectConnect API running on Railway`);
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`🌐 Listening on 0.0.0.0:${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

module.exports = app;
