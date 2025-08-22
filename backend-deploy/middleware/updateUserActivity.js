const User = require('../models/User');

// Middleware to update user's last active timestamp
const updateUserActivity = async (req, res, next) => {
  // Only update activity for authenticated users
  if (req.user && req.user.id) {
    try {
      // Update last activity in background, don't block the request
      User.updateLastActive(req.user.id).catch(console.error);
    } catch (error) {
      // Silently fail - don't block the request for activity tracking errors
      console.error('Error updating user activity:', error);
    }
  }
  next();
};

module.exports = updateUserActivity;
