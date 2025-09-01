export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For demo purposes, we'll simulate GitHub OAuth
  try {
    const clientId = process.env.GITHUB_CLIENT_ID || 'demo_client_id';
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 
      'https://project-connect-amfi3c0j5-parthd4567-gmailcoms-projects.vercel.app/api/auth/github/callback';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user:email`;

    // For demo purposes, we'll return a message instead of redirecting
    res.status(200).json({
      message: 'GitHub OAuth not fully configured',
      note: 'This is a demo. In production, you would need to set up GitHub OAuth credentials.',
      authUrl: githubAuthUrl,
      instructions: 'Please use regular email/password signup for now.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting up GitHub OAuth',
      error: error.message
    });
  }
}
