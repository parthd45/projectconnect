const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, skills_needed } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long'
      });
    }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      skills_needed: Array.isArray(skills_needed) ? skills_needed : (skills_needed ? [skills_needed] : []),
      creator_id: req.user.id
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating project'
    });
  }
});

// @route   GET /api/projects
// @desc    Get all projects with pagination
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.getAll(parseInt(limit), offset);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: projects.length
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects'
    });
  }
});

// @route   GET /api/projects/search
// @desc    Search projects by title, description, or skills
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: searchTerm } = req.query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search term must be at least 2 characters long'
      });
    }

    const projects = await Project.search(searchTerm.trim());

    res.json({
      success: true,
      data: {
        projects,
        searchTerm: searchTerm.trim()
      }
    });

  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching projects'
    });
  }
});

// @route   GET /api/projects/my
// @desc    Get projects created by current user
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.getByUserId(req.user.id, parseInt(limit), offset);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: projects.length
        }
      }
    });

  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your projects'
    });
  }
});

// @route   GET /api/projects/joined
// @desc    Get projects user is a member of
// @access  Private
router.get('/joined', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.getUserProjects(req.user.id, parseInt(limit), offset);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: projects.length
        }
      }
    });

  } catch (error) {
    console.error('Get joined projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching joined projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get project members
    const members = await Project.getMembers(projectId);

    res.json({
      success: true,
      data: {
        project,
        members
      }
    });

  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (only creator)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { title, description, skills_needed } = req.body;
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const updateData = {
      title: title.trim(),
      description: description.trim(),
      skills_needed: Array.isArray(skills_needed) ? skills_needed : (skills_needed ? [skills_needed] : [])
    };

    const project = await Project.update(projectId, updateData, req.user.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you are not authorized to update it'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating project'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (only creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const project = await Project.delete(projectId, req.user.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you are not authorized to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting project'
    });
  }
});

// @route   POST /api/projects/:id/join
// @desc    Join a project
// @access  Private
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is already a member
    const isMember = await Project.isMember(projectId, req.user.id);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project'
      });
    }

    // Check if user is the creator
    if (project.creator_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot join your own project'
      });
    }

    const membership = await Project.addMember(projectId, req.user.id);

    res.json({
      success: true,
      message: 'Successfully joined project',
      data: {
        membership
      }
    });

  } catch (error) {
    console.error('Join project error:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error joining project'
    });
  }
});

// @route   DELETE /api/projects/:id/leave
// @desc    Leave a project
// @access  Private
router.delete('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Check if user is a member
    const isMember = await Project.isMember(projectId, req.user.id);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this project'
      });
    }

    const query = 'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *';
    const { pool } = require('../config/database');
    const result = await pool.query(query, [projectId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully left project'
    });

  } catch (error) {
    console.error('Leave project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error leaving project'
    });
  }
});

module.exports = router;

module.exports = router;
