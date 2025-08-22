const express = require('express');
const router = express.Router();
const ProjectRequest = require('../models/ProjectRequest');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /project-requests
// @desc    Send a join request to a project
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { project_id, message } = req.body;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Check if user already requested
    const hasRequested = await ProjectRequest.hasRequested(project_id, req.user.id);
    if (hasRequested) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request to this project'
      });
    }

    const requestData = {
      project_id: parseInt(project_id),
      user_id: req.user.id,
      message: message || ''
    };

    const request = await ProjectRequest.create(requestData);

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({
      success: false,
      message: error.code === '23505' ? 'Request already exists' : 'Server error sending request'
    });
  }
});

// @route   GET /project-requests/project/:projectId
// @desc    Get all requests for a project (for project owner)
// @access  Private
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const requests = await ProjectRequest.getProjectRequests(projectId);

    res.json({
      success: true,
      data: { requests }
    });

  } catch (error) {
    console.error('Get project requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests'
    });
  }
});

// @route   GET /project-requests/my
// @desc    Get all requests sent by current user
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const requests = await ProjectRequest.getUserRequests(req.user.id);

    res.json({
      success: true,
      data: { requests }
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your requests'
    });
  }
});

// @route   PUT /project-requests/:requestId/status
// @desc    Accept or reject a join request
// @access  Private (project owner only)
router.put('/:requestId/status', authenticateToken, async (req, res) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { status } = req.body;

    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"'
      });
    }

    const updatedRequest = await ProjectRequest.updateStatus(requestId, status, req.user.id);

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: { request: updatedRequest }
    });

  } catch (error) {
    console.error('Update request status error:', error);
    
    if (error.message === 'Request not found' || error.message === 'Unauthorized to update this request') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating request status'
    });
  }
});

// @route   GET /project-requests/incoming
// @desc    Get all incoming requests for current user's projects
// @access  Private
router.get('/incoming', authenticateToken, async (req, res) => {
  try {
    console.log(`Fetching incoming requests for user ID: ${req.user.id}`);
    const incomingRequests = await ProjectRequest.getIncomingRequests(req.user.id);
    console.log(`Found ${incomingRequests.length} incoming requests:`, incomingRequests);

    res.json({
      success: true,
      data: {
        requests: incomingRequests
      }
    });

  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching incoming requests'
    });
  }
});

module.exports = router;
