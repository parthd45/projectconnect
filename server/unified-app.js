const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());
app.use(cors());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'ProjectConnect API + Frontend on same domain!'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Unified backend working!',
    success: true,
    version: '3.0.0'
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ProjectConnect (Frontend + Backend) running on port ${PORT}`);
  console.log(`✅ Everything served from one domain!`);
});

module.exports = app;
