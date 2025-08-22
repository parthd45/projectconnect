const { body, validationResult } = require('express-validator');
const db = require('../db');

/**
 * Get user profile by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT id, name, email, college, skills, github_link, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, college, skills, github_link } = req.body;
    const userId = req.userId;

    // Convert skills string to array if needed
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());

    // Update user profile
    const result = await db.query(
      'UPDATE users SET name = $1, college = $2, skills = $3, github_link = $4 WHERE id = $5 RETURNING id, name, email, college, skills, github_link, created_at',
      [name, college, skillsArray, github_link, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

/**
 * Search users by skills or name
 */
const searchUsers = async (req, res) => {
  try {
    const { search, skills } = req.query;
    let query = 'SELECT id, name, email, college, skills, github_link, created_at FROM users';
    const params = [];
    const conditions = [];

    // Add search conditions
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR college ILIKE $${params.length})`);
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      params.push(skillsArray);
      conditions.push(`skills && $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);

    res.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error while searching users' });
  }
};

/**
 * Send a message to another user
 */
const sendMessage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiver_id, content } = req.body;
    const sender_id = req.userId;

    // Check if receiver exists
    const receiverResult = await db.query('SELECT id FROM users WHERE id = $1', [receiver_id]);
    if (receiverResult.rows.length === 0) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Insert message
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: result.rows[0]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

/**
 * Get messages between current user and another user
 */
const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    const result = await db.query(`
      SELECT m.*, 
             s.name as sender_name,
             r.name as receiver_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.receiver_id = r.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC
    `, [currentUserId, otherUserId]);

    res.json({
      messages: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

/**
 * Get conversations for current user
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await db.query(`
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = $1 THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        u.name as other_user_name,
        u.college as other_user_college,
        MAX(m.created_at) as last_message_time,
        (SELECT content FROM messages m2 
         WHERE (m2.sender_id = $1 AND m2.receiver_id = other_user_id) 
            OR (m2.sender_id = other_user_id AND m2.receiver_id = $1)
         ORDER BY m2.created_at DESC LIMIT 1) as last_message
      FROM messages m
      JOIN users u ON (
        CASE 
          WHEN m.sender_id = $1 THEN m.receiver_id = u.id
          ELSE m.sender_id = u.id
        END
      )
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      GROUP BY other_user_id, u.name, u.college
      ORDER BY last_message_time DESC
    `, [userId]);

    res.json({
      conversations: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error while fetching conversations' });
  }
};

// Validation rules
const updateProfileValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('college').trim().isLength({ min: 2 }).withMessage('College name must be at least 2 characters')
];

const sendMessageValidation = [
  body('receiver_id').isInt().withMessage('Receiver ID must be a valid integer'),
  body('content').trim().isLength({ min: 1 }).withMessage('Message content cannot be empty')
];

module.exports = {
  getUserById,
  updateProfile,
  searchUsers,
  sendMessage,
  getMessages,
  getConversations,
  updateProfileValidation,
  sendMessageValidation
};
