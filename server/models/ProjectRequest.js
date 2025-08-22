const { pool } = require('../config/database');

class ProjectRequest {
  // Send a join request to a project
  static async create(requestData) {
    const { project_id, user_id, message } = requestData;
    
    try {
      const query = `
        INSERT INTO project_requests (project_id, user_id, message)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const values = [project_id, user_id, message];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all requests for a project (for project owner)
  static async getProjectRequests(projectId) {
    try {
      const query = `
        SELECT pr.*, u.name as user_name, u.email as user_email, u.skills, u.github_link
        FROM project_requests pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.project_id = $1
        ORDER BY pr.created_at DESC
      `;
      const result = await pool.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all requests sent by a user
  static async getUserRequests(userId) {
    try {
      const query = `
        SELECT pr.*, p.title as project_title, p.description as project_description,
               u.name as project_owner_name
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        JOIN users u ON p.creator_id = u.id
        WHERE pr.user_id = $1
        ORDER BY pr.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Accept or reject a request
  static async updateStatus(requestId, status, projectOwnerId) {
    try {
      // First check if the request belongs to a project owned by this user
      const checkQuery = `
        SELECT pr.*, p.creator_id 
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        WHERE pr.id = $1
      `;
      const checkResult = await pool.query(checkQuery, [requestId]);
      
      if (!checkResult.rows[0]) {
        throw new Error('Request not found');
      }
      
      if (checkResult.rows[0].creator_id !== projectOwnerId) {
        throw new Error('Unauthorized to update this request');
      }

      const updateQuery = `
        UPDATE project_requests 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, [status, requestId]);
      
      // If accepted, add user to project_members and create initial message
      if (status === 'accepted') {
        const request = checkResult.rows[0];
        
        // Add to project members
        await pool.query(`
          INSERT INTO project_members (project_id, user_id, role)
          VALUES ($1, $2, 'member')
          ON CONFLICT (project_id, user_id) DO NOTHING
        `, [request.project_id, request.user_id]);
        
        // Create initial welcome message from project owner to new member
        const projectQuery = `SELECT title, creator_id FROM projects WHERE id = $1`;
        const projectResult = await pool.query(projectQuery, [request.project_id]);
        const project = projectResult.rows[0];
        
        if (project) {
          const welcomeMessage = `Welcome to "${project.title}"! I'm excited to have you on the team. Let's collaborate and make this project amazing! 🚀`;
          
          await pool.query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3)
          `, [project.creator_id, request.user_id, welcomeMessage]);
          
          // Also create a response message from the new member
          const responseMessage = `Thank you for accepting me into "${project.title}"! I'm looking forward to contributing and working together. 💪`;
          
          await pool.query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3)
          `, [request.user_id, project.creator_id, responseMessage]);
        }
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if user already sent request to project
  static async hasRequested(projectId, userId) {
    try {
      const query = `
        SELECT id FROM project_requests 
        WHERE project_id = $1 AND user_id = $2
      `;
      const result = await pool.query(query, [projectId, userId]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get request by ID
  static async findById(requestId) {
    try {
      const query = `
        SELECT pr.*, p.title as project_title, u.name as user_name
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        JOIN users u ON pr.user_id = u.id
        WHERE pr.id = $1
      `;
      const result = await pool.query(query, [requestId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user's collaborations (accepted requests)
  static async getUserCollaborations(userId) {
    try {
      const query = `
        SELECT pr.*, p.title as project_title, p.description as project_description
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        WHERE pr.user_id = $1 AND pr.status = 'accepted'
        ORDER BY pr.updated_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get recent activity
  static async getRecentActivity(userId, limit = 5) {
    try {
      const query = `
        SELECT pr.*, p.title as project_title
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        WHERE pr.user_id = $1 AND pr.status = 'accepted'
        ORDER BY pr.updated_at DESC
        LIMIT $2
      `;
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get incoming requests for user's projects
  static async getIncomingRequests(userId) {
    try {
      const query = `
        SELECT pr.*, 
               p.title as project_title, 
               p.description as project_description,
               u.name as user_name, 
               u.email as user_email, 
               u.skills as user_skills,
               u.github_link as user_github
        FROM project_requests pr
        JOIN projects p ON pr.project_id = p.id
        JOIN users u ON pr.user_id = u.id
        WHERE p.creator_id = $1 AND pr.status = 'pending'
        ORDER BY pr.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProjectRequest;
