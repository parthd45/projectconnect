const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting Minimal ProjectConnect Backend...');

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect API',
    version: '1.0.2',
    status: 'running',
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal Backend running on port ${PORT}`);
  console.log(`✅ Status: HEALTHY and READY`);
});

module.exports = app;
