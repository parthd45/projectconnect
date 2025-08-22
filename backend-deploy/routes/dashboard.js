const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Project = require('../models/Project');
const Message = require('../models/Message');
const ProjectRequest = require('../models/ProjectRequest');
const { pool } = require('../config/database');

// @route   GET /api/dashboard/public-stats
// @desc    Get public statistics for the platform
// @access  Public
router.get('/public-stats', async (req, res) => {
  try {
    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total projects count
    const projectsResult = await pool.query('SELECT COUNT(*) as count FROM projects');
    const totalProjects = parseInt(projectsResult.rows[0].count);

    // Get active users (logged in within last 7 days)
    const activeUsersResult = await pool.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE last_active >= NOW() - INTERVAL '7 days'
    `);
    const activeUsers = parseInt(activeUsersResult.rows[0].count);

    // Calculate uptime percentage (mock for now, you can implement real monitoring)
    const uptime = 99.5; // You can replace this with real uptime monitoring

    const stats = {
      totalUsers: totalUsers,
      activeUsers: activeUsers,
      totalProjects: totalProjects,
      uptime: uptime
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public statistics'
    });
  }
});

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for the authenticated user
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's projects (created by user)
    const userProjects = await Project.getUserProjects(userId);
    
    // Get projects user is collaborating on (project requests accepted)
    const collaborationProjects = await ProjectRequest.getUserCollaborations(userId);
    
    // Get user's messages count (approximate from recent activity)
    const messageCount = await Message.getUserMessageCount(userId);
    
    // Get recent activity count (last 30 days)
    const recentActivityCount = await Project.getRecentActivityCount(userId, 30);

    const stats = {
      totalProjects: userProjects.length,
      activeCollaborations: collaborationProjects.length,
      totalMessages: messageCount,
      recentActivity: recentActivityCount
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity for the authenticated user
// @access  Private
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent projects created by user
    const recentProjects = await Project.getUserProjects(userId, 3);
    
    // Get recent collaborations
    const recentCollaborations = await ProjectRequest.getRecentActivity(userId, 3);
    
    // Get recent messages
    const recentMessages = await Message.getRecentActivity(userId, 3);

    // Combine and format activities
    const activities = [];

    // Add recent project creations
    recentProjects.forEach(project => {
      activities.push({
        id: `project_${project.id}`,
        type: 'project',
        message: `Created project "${project.title}"`,
        time: formatTimeAgo(project.created_at),
        icon: 'Plus',
        createdAt: project.created_at
      });
    });

    // Add recent collaborations
    recentCollaborations.forEach(collab => {
      if (collab.status === 'accepted') {
        activities.push({
          id: `collab_${collab.id}`,
          type: 'collaboration', 
          message: `Joined project "${collab.project_title}"`,
          time: formatTimeAgo(collab.updated_at),
          icon: 'Users',
          createdAt: collab.updated_at
        });
      }
    });

    // Add recent messages
    recentMessages.forEach(message => {
      activities.push({
        id: `message_${message.id}`,
        type: 'message',
        message: `New message in "${message.project_title || 'Unknown Project'}"`,
        time: formatTimeAgo(message.created_at),
        icon: 'MessageCircle',
        createdAt: message.created_at
      });
    });

    // Sort by creation date and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: limitedActivities
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity'
    });
  }
});

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
}

module.exports = router;
