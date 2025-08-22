const { pool } = require('../config/database');

class Project {
  // Create new project
  static async create(projectData) {
    const { title, description, skills_needed, creator_id } = projectData;
    
    try {
      const query = `
        INSERT INTO projects (title, description, skills_needed, creator_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, description, skills_needed, creator_id, created_at
      `;
      
      const values = [title, description, skills_needed, creator_id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find project by ID
  static async findById(id) {
    try {
      const query = `
        SELECT p.*, u.name as creator_name, u.email as creator_email
        FROM projects p
        JOIN users u ON p.creator_id = u.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all projects with pagination
  static async getAll(limit = 20, offset = 0) {
    try {
      const query = `
        SELECT p.*, u.name as creator_name, u.email as creator_email,
               (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.creator_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Search projects by title, description, or skills
  static async search(searchTerm) {
    try {
      const query = `
        SELECT p.*, u.name as creator_name, u.email as creator_email,
               (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.creator_id = u.id
        WHERE p.title ILIKE $1 OR p.description ILIKE $1 OR $1 = ANY(p.skills_needed)
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update project
  static async update(id, updateData, userId) {
    const { title, description, skills_needed } = updateData;
    
    try {
      const query = `
        UPDATE projects 
        SET title = $1, description = $2, skills_needed = $3
        WHERE id = $4 AND creator_id = $5
        RETURNING id, title, description, skills_needed, creator_id, created_at
      `;
      
      const values = [title, description, skills_needed, id, userId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete project
  static async delete(id, userId) {
    try {
      const query = 'DELETE FROM projects WHERE id = $1 AND creator_id = $2 RETURNING *';
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get projects by user ID
  static async getByUserId(userId, limit = 20, offset = 0) {
    try {
      const query = `
        SELECT p.*, u.name as creator_name, u.email as creator_email,
               (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.creator_id = u.id
        WHERE p.creator_id = $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get project members
  static async getMembers(projectId) {
    try {
      const query = `
        SELECT pm.*, u.name, u.email, u.college, u.skills, u.github_link
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = $1
        ORDER BY pm.joined_at ASC
      `;
      const result = await pool.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Add member to project
  static async addMember(projectId, userId, role = 'member') {
    try {
      const query = `
        INSERT INTO project_members (project_id, user_id, role)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [projectId, userId, role]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Remove member from project
  static async removeMember(projectId, userId, requestingUserId) {
    try {
      // Check if requesting user is the project creator
      const projectQuery = 'SELECT creator_id FROM projects WHERE id = $1';
      const projectResult = await pool.query(projectQuery, [projectId]);
      
      if (!projectResult.rows[0] || projectResult.rows[0].creator_id !== requestingUserId) {
        throw new Error('Only project creator can remove members');
      }

      const query = 'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *';
      const result = await pool.query(query, [projectId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if user is member of project
  static async isMember(projectId, userId) {
    try {
      const query = 'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2';
      const result = await pool.query(query, [projectId, userId]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get projects user is a member of
  static async getUserProjects(userId, limit = 20, offset = 0) {
    try {
      const query = `
        SELECT p.*, u.name as creator_name, u.email as creator_email,
               pm.role, pm.joined_at,
               (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.creator_id = u.id
        LEFT JOIN project_members pm ON p.id = pm.project_id
        WHERE p.creator_id = $1 OR pm.user_id = $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get recent activity count for user
  static async getRecentActivityCount(userId, days = 30) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM projects p
        WHERE p.creator_id = $1
        AND p.created_at >= NOW() - INTERVAL '${days} days'
      `;
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;
