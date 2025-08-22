const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (for finding teammates)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.getAll(parseInt(limit), offset);
    
    // Filter out current user from results
    const filteredUsers = users.filter(user => user.id !== req.user.id);

    res.json({
      success: true,
      data: {
        users: filteredUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredUsers.length
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by skills or college
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: searchTerm, college } = req.query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search term must be at least 2 characters long'
      });
    }

    const users = await User.search(searchTerm.trim(), college);
    
    // Filter out current user from results
    const filteredUsers = users.filter(user => user.id !== req.user.id);

    res.json({
      success: true,
      data: {
        users: filteredUsers,
        searchTerm: searchTerm.trim(),
        college: college || null
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// @route   POST /api/users/update-status
// @desc    Update user's activity status and last active time
// @access  Private
router.post('/update-status', authenticateToken, async (req, res) => {
  try {
    const { isActive, lastActive } = req.body;
    const userId = req.user.id;

    await User.updateLastActive(userId, lastActive || new Date().toISOString());

    res.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating status'
    });
  }
});

// @route   POST /api/users/status
// @desc    Get status for multiple users
// @access  Private
router.post('/status', authenticateToken, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const usersWithStatus = await User.getUsersWithStatus(userIds);

    res.json({
      success: true,
      data: usersWithStatus
    });

  } catch (error) {
    console.error('Get users status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users status'
    });
  }
});

// @route   GET /api/users/:id/status
// @desc    Get status for a specific user
// @access  Private
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const userWithStatus = await User.findByIdWithStatus(userId);

    if (!userWithStatus) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userWithStatus
    });

  } catch (error) {
    console.error('Get user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user status'
    });
  }
});

module.exports = router;
