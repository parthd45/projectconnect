const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProjectConnect API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ProjectConnect API v1.0',
    status: 'active',
    endpoints: ['/api/projects', '/api/users', '/api/health']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/api/projects', (req, res) => {
  res.json({
    projects: [
      { id: 1, title: 'Sample Project', description: 'A sample project' }
    ]
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Sample User', email: 'user@example.com' }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
