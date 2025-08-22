const { pool } = require('./config/database');
const crypto = require('crypto');
const User = require('./models/User');

async function simulateForgotPassword() {
  try {
    console.log('🔄 Simulating forgot password flow...');
    
    // Generate a test token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
    
    console.log('📧 Generated reset token:', resetToken);
    console.log('⏰ Token expires at:', resetTokenExpires);
    
    // You can use this URL to test the reset flow:
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('🔗 Reset URL:', resetUrl);
    
    // Save token to database for a test user (you'll need a real user email)
    const testEmail = 'test@example.com';
    console.log('💾 Saving token for email:', testEmail);
    
    // For demo purposes, just show the token
    console.log('\n✅ Copy this URL to test password reset:');
    console.log('📋', resetUrl);
    console.log('\n💡 Note: You can manually update the database with this token for testing');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

simulateForgotPassword();
