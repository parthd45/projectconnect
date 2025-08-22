const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Railway environment detection
const isRailway = process.env.RAILWAY_ENVIRONMENT_NAME;
const isProduction = process.env.NODE_ENV === 'production';

console.log(`🚀 Environment: ${isRailway ? 'Railway' : 'Local'}`);
console.log(`🌐 Port: ${PORT}`);
console.log(`📦 Production: ${isProduction}`);

console.log('🚀 Starting Minimal ProjectConnect Backend...');

console.log('🚀 Starting Minimal ProjectConnect Backend...');

// Basic middleware
app.use(express.json());
// CORS configuration for Railway deployment
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

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect API - Railway Deployment',
    version: '1.0.3',
    status: 'running',
    environment: process.env.RAILWAY_ENVIRONMENT_NAME || 'local',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic API test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', success: true });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Minimal Backend running on port ${PORT}`);
  console.log(`✅ Status: HEALTHY and READY`);
  console.log(`🌐 Server address: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

module.exports = app;
