const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, college, skills, interests, bio, github_link, google_id, github_id } = userData;
    
    try {
      // Hash password only if provided (not for OAuth users)
      let passwordHash = null;
      if (password) {
        passwordHash = await bcrypt.hash(password, 12);
      }
      
      // Convert skills to array if it's a string
      const skillsArray = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
      
      const query = `
        INSERT INTO users (name, email, password_hash, college, skills, github_link, google_id, github_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, college, skills, github_link, google_id, github_id, created_at
      `;
      
      const values = [
        name, 
        email, 
        passwordHash, 
        college || 'Amravati University', 
        skillsArray, 
        github_link,
        google_id,
        github_id
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = `
        SELECT id, name, email, college, skills, github_link, created_at
        FROM users WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, updateData) {
    const { name, college, skills, github_link } = updateData;
    
    try {
      const query = `
        UPDATE users 
        SET name = $1, college = $2, skills = $3, github_link = $4
        WHERE id = $5
        RETURNING id, name, email, college, skills, github_link, created_at
      `;
      
      const values = [name, college, skills, github_link, id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users (for finding teammates)
  static async getAll(limit = 50, offset = 0) {
    try {
      const query = `
        SELECT id, name, email, college, skills, github_link, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Search users by skills or college
  static async search(searchTerm, college = null) {
    try {
      let query = `
        SELECT id, name, email, college, skills, github_link, created_at
        FROM users
        WHERE (name ILIKE $1 OR $1 = ANY(skills))
      `;
      
      const values = [`%${searchTerm}%`];
      
      if (college) {
        query += ` AND college = $2`;
        values.push(college);
      }
      
      query += ` ORDER BY created_at DESC`;
      
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user's last activity timestamp
  static async updateLastActive(userId) {
    try {
      const query = 'UPDATE users SET last_active = NOW() WHERE id = $1';
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }

  // Get user with last activity status
  static async findByIdWithStatus(id) {
    try {
      const query = `
        SELECT id, name, email, college, skills, github_link, created_at, last_active,
               CASE 
                 WHEN last_active >= NOW() - INTERVAL '2 minutes' THEN true
                 ELSE false
               END as is_online
        FROM users WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get users with online status for conversations
  static async getUsersWithStatus(userIds) {
    try {
      const query = `
        SELECT id, name, email, college, skills, github_link, created_at, last_active,
               CASE 
                 WHEN last_active >= NOW() - INTERVAL '2 minutes' THEN true
                 ELSE false
               END as is_online
        FROM users WHERE id = ANY($1)
      `;
      const result = await pool.query(query, [userIds]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Set password reset token
  static async setPasswordResetToken(email, token, expiresAt) {
    try {
      const query = `
        UPDATE users 
        SET reset_token = $1, reset_token_expires = $2
        WHERE email = $3
        RETURNING id, name, email
      `;
      const result = await pool.query(query, [token, expiresAt, email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by reset token
  static async findByResetToken(token) {
    try {
      const query = `
        SELECT * FROM users 
        WHERE reset_token = $1 AND reset_token_expires > NOW()
      `;
      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update password and clear reset token
  static async updatePasswordByToken(token, newPassword) {
    try {
      const passwordHash = await bcrypt.hash(newPassword, 12);
      const query = `
        UPDATE users 
        SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
        WHERE reset_token = $2 AND reset_token_expires > NOW()
        RETURNING id, name, email
      `;
      const result = await pool.query(query, [passwordHash, token]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
