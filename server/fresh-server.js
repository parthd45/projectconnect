const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://projectconnect.tech',
    'https://yellow-river-0686b2500.azurestaticapps.net',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect API v2.0 - Fresh Azure Deployment',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Fresh Azure backend is working perfectly!',
    success: true,
    data: {
      server: 'Azure App Service',
      frontend: 'projectconnect.tech',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = app;
