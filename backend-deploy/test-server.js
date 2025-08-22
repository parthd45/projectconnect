const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working' });
});

app.listen(5001, () => {
  console.log('🚀 Test server running on port 5001');
});
