// Simple Vercel serverless function
export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from ProjectConnect API!',
    timestamp: new Date().toISOString(),
    method: req.method,
    success: true
  });
}
