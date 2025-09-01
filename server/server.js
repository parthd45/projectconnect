const express = require('express');
const cors = require('cors');

const app = express();

// Get port from environment
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting ProjectConnect API on Azure...');
console.log(`📍 Port: ${PORT}`);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'ProjectConnect API running on Azure!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
