const express = require('express');
const cors = require('cors');

const app = express();

// Azure sets PORT environment variable  
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 80;

console.log('🚀 Starting ProjectConnect API...');
console.log(`📍 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

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
    message: 'ProjectConnect API v2 - Azure Deployment',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    uptime: process.uptime()
  });
});

// API health endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 API health check requested');
  res.status(200).json({
    status: 'healthy',
    api: 'working',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.status(200).json({
    message: 'Backend is working perfectly!',
    success: true,
    version: '2.1.0',
    backend: 'Azure App Service',
    frontend: 'projectconnect.tech'
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

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ProjectConnect API v2 running on port ${PORT}`);
  console.log(`✅ Server started successfully`);
  console.log(`🌐 Listening on 0.0.0.0:${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

module.exports = app;
