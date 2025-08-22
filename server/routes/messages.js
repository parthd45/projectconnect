const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

// Debug route to test database connections
router.get('/debug/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const conversations = await Message.getUserConversations(userId);
    
    res.json({
      success: true,
      data: {
        userId,
        conversations,
        count: conversations.length
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message to another user
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;

    // Validate input
    if (!receiver_id || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    if (parseInt(receiver_id) === parseInt(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    const messageData = {
      sender_id: req.user.id,
      receiver_id: parseInt(receiver_id),
      content: content.trim()
    };

    const message = await Message.create(messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending message'
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Message.getUserConversations(req.user.id);

    res.json({
      success: true,
      data: {
        conversations
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversations'
    });
  }
});

// @route   GET /api/messages/user/:userId
// @desc    Get or create conversation with specific user
// @access  Private
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    
    if (isNaN(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (otherUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Get or create conversation
    const conversation = await Message.createConversation(req.user.id, otherUserId);

    res.json({
      success: true,
      data: {
        conversation
      }
    });

  } catch (error) {
    console.error('Get/create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating conversation'
    });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation with specific user
// @access  Private
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    
    if (isNaN(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (otherUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot get conversation with yourself'
      });
    }

    const messages = await Message.getConversation(req.user.id, otherUserId);

    res.json({
      success: true,
      data: {
        messages
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversation'
    });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get conversation with specific user (alternative route)
// @access  Private
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    
    if (isNaN(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (otherUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot get conversation with yourself'
      });
    }

    const messages = await Message.getConversation(req.user.id, otherUserId);

    res.json({
      success: true,
      data: {
        messages
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversation'
    });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get total unread message count for current user
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Message.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: {
        unread_count: unreadCount
      }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching unread count'
    });
  }
});

// @route   GET /api/messages/notifications
// @desc    Get recent unread messages for notifications
// @access  Private
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Message.getRecentUnreadMessages(req.user.id, 5);

    res.json({
      success: true,
      data: {
        notifications
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
});

// @route   PUT /api/messages/mark-read/:senderId
// @desc    Mark messages from specific sender as read
// @access  Private
router.put('/mark-read/:senderId', authenticateToken, async (req, res) => {
  try {
    const senderId = parseInt(req.params.senderId);
    
    if (isNaN(senderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sender ID'
      });
    }

    await Message.markAsRead(senderId, req.user.id);

    res.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking messages as read'
    });
  }
});

module.exports = router;
