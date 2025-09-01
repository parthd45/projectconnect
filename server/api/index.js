// Vercel Serverless Function
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { method, url } = req;
  
  // Root endpoint
  if (url === '/' && method === 'GET') {
    res.status(200).json({
      message: 'ProjectConnect API - Vercel Deployment',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      platform: 'Vercel Serverless',
      version: '2.0.0',
      success: true
    });
    return;
  }
  
  // API health endpoint
  if (url === '/api/health' && method === 'GET') {
    res.status(200).json({
      status: 'healthy',
      api: 'working',
      timestamp: new Date().toISOString(),
      platform: 'Vercel',
      success: true
    });
    return;
  }
  
  // API test endpoint
  if (url === '/api/test' && method === 'GET') {
    res.status(200).json({
      message: 'Backend is working perfectly on Vercel!',
      success: true,
      version: '2.0.0',
      backend: 'Vercel Serverless',
      frontend: 'projectconnect.tech',
      deployment: 'success'
    });
    return;
  }
  
  // Default 404
  res.status(404).json({
    error: 'API endpoint not found',
    path: url,
    method: method,
    message: 'This API endpoint is not implemented yet'
  });
}
