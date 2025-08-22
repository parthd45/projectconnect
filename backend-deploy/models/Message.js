const { pool } = require('../config/database');

class Message {
  // Send a message
  static async create(messageData) {
    const { sender_id, receiver_id, content } = messageData;
    
    try {
      const query = `
        INSERT INTO messages (sender_id, receiver_id, content, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, sender_id, receiver_id, content, created_at
      `;
      
      const values = [sender_id, receiver_id, content];
      const result = await pool.query(query, values);
      
      // Convert the timestamp to ISO string for consistent handling
      const message = result.rows[0];
      message.created_at = new Date(message.created_at).toISOString();
      
      return message;
    } catch (error) {
      throw error;
    }
  }

  // Get conversation between two users
  static async getConversation(user1_id, user2_id, limit = 50) {
    try {
      const query = `
        SELECT m.*, 
               s.name as sender_name, s.email as sender_email,
               r.name as receiver_name, r.email as receiver_email
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.receiver_id = r.id
        WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
           OR (m.sender_id = $2 AND m.receiver_id = $1)
        ORDER BY m.created_at ASC
        LIMIT $3
      `;
      const result = await pool.query(query, [user1_id, user2_id, limit]);
      
      // Convert timestamps to ISO strings for consistent handling
      const messages = result.rows.map(message => ({
        ...message,
        created_at: new Date(message.created_at).toISOString()
      }));
      
      return messages;
    } catch (error) {
      throw error;
    }
  }

  // Get all conversations for a user
  static async getUserConversations(userId) {
    try {
      console.log('Getting conversations for user:', userId);
      
      // Get users who have message history with current user
      const messageContactsQuery = `
        SELECT DISTINCT 
          u.id,
          u.name,
          u.email,
          u.last_active,
          CASE 
            WHEN u.last_active >= NOW() - INTERVAL '2 minutes' THEN true
            ELSE false
          END as is_online,
          MAX(m.created_at) as last_message_time,
          (SELECT content FROM messages m2 
           WHERE (m2.sender_id = $1 AND m2.receiver_id = u.id) 
              OR (m2.sender_id = u.id AND m2.receiver_id = $1)
           ORDER BY m2.created_at DESC LIMIT 1) as last_message,
          'message' as source
        FROM messages m
        JOIN users u ON (
          CASE 
            WHEN m.sender_id = $1 THEN m.receiver_id = u.id
            ELSE m.sender_id = u.id
          END
        )
        WHERE (m.sender_id = $1 OR m.receiver_id = $1)
          AND u.id != $1
        GROUP BY u.id, u.name, u.email, u.last_active
      `;
      
      // Get project collaborators (people in same projects)
      const collaboratorsQuery = `
        SELECT DISTINCT 
          u.id,
          u.name,
          u.email,
          u.last_active,
          CASE 
            WHEN u.last_active >= NOW() - INTERVAL '2 minutes' THEN true
            ELSE false
          END as is_online,
          NULL as last_message_time,
          'Available to chat - Project collaborator' as last_message,
          'collaborator' as source
        FROM users u
        WHERE u.id IN (
          -- Users who are members of projects I own
          SELECT pm.user_id 
          FROM project_members pm
          JOIN projects p ON pm.project_id = p.id
          WHERE p.creator_id = $1
          
          UNION
          
          -- Users who own projects I'm a member of
          SELECT p.creator_id
          FROM project_members pm
          JOIN projects p ON pm.project_id = p.id
          WHERE pm.user_id = $1
        )
        AND u.id != $1
        AND u.id NOT IN (
          -- Exclude users who already have message history
          SELECT DISTINCT 
            CASE 
              WHEN m.sender_id = $1 THEN m.receiver_id
              ELSE m.sender_id
            END
          FROM messages m
          WHERE (m.sender_id = $1 OR m.receiver_id = $1)
        )
      `;
      
      console.log('Getting message contacts...');
      const messageContacts = await pool.query(messageContactsQuery, [userId]);
      console.log('Found message contacts:', messageContacts.rows.length);
      
      console.log('Getting collaborators...');
      const collaborators = await pool.query(collaboratorsQuery, [userId]);
      console.log('Found collaborators:', collaborators.rows.length);
      
      // Get unread counts for each conversation
      const unreadCounts = await this.getUnreadCountPerConversation(userId);
      
      // Combine message contacts and collaborators
      const allContacts = [...messageContacts.rows, ...collaborators.rows];
      
      const conversations = allContacts.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        last_message: row.last_message,
        last_message_time: row.last_message_time,
        source: row.source,
        unread_count: unreadCounts[row.id] || 0,
        is_online: row.is_online,
        last_active: row.last_active
      }));
      
      // Sort by last message time (recent first), then by name for collaborators
      conversations.sort((a, b) => {
        if (a.last_message_time && b.last_message_time) {
          return new Date(b.last_message_time) - new Date(a.last_message_time);
        } else if (a.last_message_time) {
          return -1; // a has messages, put it first
        } else if (b.last_message_time) {
          return 1; // b has messages, put it first
        } else {
          return a.name.localeCompare(b.name); // both are collaborators, sort by name
        }
      });
      
      console.log('Final conversations:', conversations.length);
      return conversations;
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      throw error;
    }
  }

  // Create a conversation by adding the user to conversations list (for new chats)
  static async createConversation(userId, otherUserId) {
    try {
      // Get user details
      const userQuery = `SELECT id, name, email FROM users WHERE id = $1`;
      const userResult = await pool.query(userQuery, [otherUserId]);
      
      if (!userResult.rows[0]) {
        throw new Error('User not found');
      }
      
      const user = userResult.rows[0];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        last_message: null,
        last_message_time: null
      };
    } catch (error) {
      throw error;
    }
  }

  // Get unread message count for a user
  static async getUnreadCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as unread_count
        FROM messages 
        WHERE receiver_id = $1 
        AND read_at IS NULL
      `;
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].unread_count) || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Get unread message count per conversation
  static async getUnreadCountPerConversation(userId) {
    try {
      const query = `
        SELECT sender_id, COUNT(*) as unread_count
        FROM messages 
        WHERE receiver_id = $1 
        AND read_at IS NULL
        GROUP BY sender_id
      `;
      const result = await pool.query(query, [userId]);
      
      const unreadCounts = {};
      result.rows.forEach(row => {
        unreadCounts[row.sender_id] = parseInt(row.unread_count);
      });
      
      return unreadCounts;
    } catch (error) {
      console.error('Error getting unread counts per conversation:', error);
      return {};
    }
  }

  // Mark messages as read when user opens conversation
  static async markAsRead(senderId, receiverId) {
    try {
      const query = `
        UPDATE messages 
        SET read_at = CURRENT_TIMESTAMP
        WHERE sender_id = $1 
        AND receiver_id = $2 
        AND read_at IS NULL
      `;
      await pool.query(query, [senderId, receiverId]);
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  // Get recent unread messages for notifications
  static async getRecentUnreadMessages(userId, limit = 5) {
    try {
      const query = `
        SELECT m.*, 
               s.name as sender_name, s.email as sender_email,
               s.last_active,
               CASE 
                 WHEN s.last_active >= NOW() - INTERVAL '2 minutes' THEN true
                 ELSE false
               END as sender_is_online
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        WHERE m.receiver_id = $1 
        AND m.read_at IS NULL
        ORDER BY m.created_at DESC
        LIMIT $2
      `;
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting recent unread messages:', error);
      return [];
    }
  }

  // Get user message count
  static async getUserMessageCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM messages m
        WHERE m.sender_id = $1 OR m.receiver_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get recent activity
  static async getRecentActivity(userId, limit = 5) {
    try {
      const query = `
        SELECT m.*, 
               u1.name as sender_name,
               u2.name as receiver_name
        FROM messages m
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        ORDER BY m.created_at DESC
        LIMIT $2
      `;
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Message;
