const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://projectconnect.tech',
    'https://yellow-river-0686b2500.azurestaticapps.net',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect API v2',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working perfectly!',
    success: true,
    version: '2.0.0'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ProjectConnect API v2 running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Listening on 0.0.0.0:${PORT}`);
});

module.exports = app;
