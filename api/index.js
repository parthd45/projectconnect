// In-memory user storage (shared across functions)
let users = [];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'ProjectConnect API is running!',
      status: 'success',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: ['/api/signin', '/api/signup'],
        general: ['/api/health', '/api/users']
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
