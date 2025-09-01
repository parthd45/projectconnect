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

  // For demo purposes, we'll simulate Google OAuth
  // In production, you'd integrate with Google OAuth 2.0
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || 'demo_client_id';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      'https://project-connect-amfi3c0j5-parthd4567-gmailcoms-projects.vercel.app/api/auth/google/callback';
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline`;

    // For demo purposes, we'll return a message instead of redirecting
    res.status(200).json({
      message: 'Google OAuth not fully configured',
      note: 'This is a demo. In production, you would need to set up Google OAuth credentials.',
      authUrl: googleAuthUrl,
      instructions: 'Please use regular email/password signup for now.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting up Google OAuth',
      error: error.message
    });
  }
}
