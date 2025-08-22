const { body, validationResult } = require('express-validator');
const db = require('../db');

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, skills_needed } = req.body;
    const creator_id = req.userId;

    // Convert skills string to array if needed
    const skillsArray = Array.isArray(skills_needed) ? skills_needed : skills_needed.split(',').map(skill => skill.trim());

    // Insert new project
    const result = await db.query(
      'INSERT INTO projects (title, description, skills_needed, creator_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, skillsArray, creator_id]
    );

    // Get project with creator information
    const projectWithCreator = await db.query(`
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.college as creator_college
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.status(201).json({
      message: 'Project created successfully',
      project: projectWithCreator.rows[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error during project creation' });
  }
};

/**
 * Get all projects with optional search
 */
const getAllProjects = async (req, res) => {
  try {
    const { search, skills } = req.query;
    let query = `
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.college as creator_college
      FROM projects p
      JOIN users u ON p.creator_id = u.id
    `;
    const params = [];
    const conditions = [];

    // Add search conditions
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      params.push(skillsArray);
      conditions.push(`p.skills_needed && $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await db.query(query, params);

    res.json({
      projects: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

/**
 * Get a single project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.college as creator_college, u.skills as creator_skills, u.github_link as creator_github
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get connection requests for this project
    const connections = await db.query(`
      SELECT c.*, u.name as requester_name, u.email as requester_email, u.college as requester_college, u.skills as requester_skills, u.github_link as requester_github
      FROM connections c
      JOIN users u ON c.requester_id = u.id
      WHERE c.project_id = $1
      ORDER BY c.created_at DESC
    `, [id]);

    res.json({
      project: result.rows[0],
      connections: connections.rows
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
};

/**
 * Get projects created by the current user
 */
const getUserProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.college as creator_college
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE p.creator_id = $1
      ORDER BY p.created_at DESC
    `, [req.userId]);

    res.json({
      projects: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error while fetching user projects' });
  }
};

/**
 * Request to connect to a project
 */
const requestConnection = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requester_id = req.userId;

    // Check if project exists
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Check if user is trying to connect to their own project
    if (project.creator_id === requester_id) {
      return res.status(400).json({ message: 'Cannot connect to your own project' });
    }

    // Check if connection already exists
    const existingConnection = await db.query(
      'SELECT * FROM connections WHERE project_id = $1 AND requester_id = $2',
      [projectId, requester_id]
    );

    if (existingConnection.rows.length > 0) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    // Create connection request
    const result = await db.query(
      'INSERT INTO connections (project_id, requester_id) VALUES ($1, $2) RETURNING *',
      [projectId, requester_id]
    );

    res.status(201).json({
      message: 'Connection request sent successfully',
      connection: result.rows[0]
    });
  } catch (error) {
    console.error('Request connection error:', error);
    res.status(500).json({ message: 'Server error during connection request' });
  }
};

/**
 * Approve or deny a connection request
 */
const updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Validate status
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "denied"' });
    }

    // Check if connection exists and user is the project owner
    const result = await db.query(`
      SELECT c.*, p.creator_id
      FROM connections c
      JOIN projects p ON c.project_id = p.id
      WHERE c.id = $1
    `, [connectionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const connection = result.rows[0];

    if (connection.creator_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this connection' });
    }

    // Update connection status
    const updateResult = await db.query(
      'UPDATE connections SET status = $1 WHERE id = $2 RETURNING *',
      [status, connectionId]
    );

    res.json({
      message: `Connection request ${status} successfully`,
      connection: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ message: 'Server error during connection update' });
  }
};

/**
 * Get connection requests for user's projects
 */
const getConnectionRequests = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, p.title as project_title, u.name as requester_name, u.email as requester_email, u.college as requester_college, u.skills as requester_skills, u.github_link as requester_github
      FROM connections c
      JOIN projects p ON c.project_id = p.id
      JOIN users u ON c.requester_id = u.id
      WHERE p.creator_id = $1
      ORDER BY c.created_at DESC
    `, [req.userId]);

    res.json({
      connections: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({ message: 'Server error while fetching connection requests' });
  }
};

// Validation rules
const createProjectValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('skills_needed').exists().withMessage('Skills needed is required')
];

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getUserProjects,
  requestConnection,
  updateConnectionStatus,
  getConnectionRequests,
  createProjectValidation
};
