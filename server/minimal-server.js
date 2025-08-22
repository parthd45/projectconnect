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
