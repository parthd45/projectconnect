const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter with Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
      }
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(email, name, resetToken) {
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: {
          name: 'ProjectConnect',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Reset Your ProjectConnect Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>ProjectConnect - Where Ideas Come to Life</p>
              </div>
              
              <div class="content">
                <h2>Hi ${name}!</h2>
                
                <p>We received a request to reset your password for your ProjectConnect account. If you made this request, click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset My Password</a>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
                  ${resetUrl}
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p><strong>Didn't request this?</strong> No worries! Your password is still secure. You can safely ignore this email.</p>
                
                <p>If you continue to receive these emails, please contact our support team.</p>
                
                <p>Best regards,<br>
                <strong>The ProjectConnect Team</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2025 ProjectConnect. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully to:', email);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Send password change confirmation email
  async sendPasswordChangeConfirmation(email, name) {
    try {
      const mailOptions = {
        from: {
          name: 'ProjectConnect',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Successfully Changed - ProjectConnect',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed Successfully</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
              .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Password Changed Successfully</h1>
                <p>ProjectConnect - Security Notification</p>
              </div>
              
              <div class="content">
                <h2>Hi ${name}!</h2>
                
                <div class="success">
                  <strong>🎉 Success!</strong> Your ProjectConnect password has been changed successfully.
                </div>
                
                <p>This email confirms that your password was updated on <strong>${new Date().toLocaleString()}</strong>.</p>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                  <li>You can now sign in with your new password</li>
                  <li>All existing sessions will remain active</li>
                  <li>Your account security has been updated</li>
                </ul>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p><strong>Didn't make this change?</strong> If you didn't change your password, please contact our support team immediately and secure your account.</p>
                
                <p>For your security, we recommend:</p>
                <ul>
                  <li>Using a strong, unique password</li>
                  <li>Keeping your login credentials secure</li>
                  <li>Signing out from shared devices</li>
                </ul>
                
                <p>Best regards,<br>
                <strong>The ProjectConnect Team</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2025 ProjectConnect. All rights reserved.</p>
                <p>This is an automated security notification.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Password change confirmation email sent to:', email);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't throw error for confirmation emails
      return false;
    }
  }
}

module.exports = new EmailService();
