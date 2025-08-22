import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatUserStatus, OnlineStatusIndicator } from '../utils/userStatus';
import { formatTime, formatDate } from '../utils/timeUtils';
import useRealtimeUserStatus from '../hooks/useRealtimeUserStatus';
import statusService from '../services/statusService';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Paperclip,
  Smile,
  Image,
  ArrowLeft
} from 'lucide-react';

const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const recentUpdatesRef = useRef(new Set()); // Track recently updated conversations

  // Get user IDs for status tracking
  const userIds = conversations.map(conv => conv.id);
  
  // Real-time user status tracking
  const { getUserStatus } = useRealtimeUserStatus(userIds, 30000);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Get all users who are project members with current user
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.data?.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced version of fetchConversations to prevent rapid successive calls


  const fetchMessages = useCallback(async (userId) => {
    try {
      const response = await axios.get(`/api/messages/conversation/${userId}`);
      setMessages(response.data.data?.messages || []);
      
      // Mark messages from this user as read
      try {
        await axios.put(`/api/messages/mark-read/${userId}`);
        // Note: We don't call fetchConversations here to avoid conflicts with sendMessage updates
      } catch (markReadError) {
        console.error('Error marking messages as read:', markReadError);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    
    // Start status tracking when component mounts
    statusService.startStatusTracking();
    
    // Add focus event listener to refresh conversations when user comes back
    const handleFocus = () => {
      setTimeout(() => {
        fetchConversations();
      }, 500);
    };
    
    // Add gentle periodic refresh for receiving new message timestamps
    const refreshInterval = setInterval(() => {
      // Only refresh if no recent local updates to avoid conflicts
      if (recentUpdatesRef.current.size === 0) {
        fetchConversations();
      }
    }, 30000); // Every 30 seconds
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup when component unmounts
    return () => {
      statusService.stopStatusTracking();
      window.removeEventListener('focus', handleFocus);
      clearInterval(refreshInterval);
    };
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      
      // Refresh conversations to get latest timestamps when switching chats
      // This ensures we see updated timestamps from other users
      setTimeout(() => {
        fetchConversations();
      }, 1000);
    }
  }, [selectedConversation, fetchMessages, fetchConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time status updates disabled to prevent timestamp conflicts
  // useRealtimeStatusUpdates(fetchConversations, 120000);

  // Handle URL parameters for direct messaging
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    const userName = urlParams.get('name');
    
    if (userId && userName) {
      console.log('Direct message params:', { userId, userName });
      
      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) {
        console.error('Invalid user ID:', userId);
        return;
      }
      
      // Try to find existing conversation first
      const existingConversation = conversations.find(conv => conv.id === numericUserId);
      if (existingConversation) {
        console.log('Found existing conversation');
        setSelectedConversation(existingConversation);
      } else {
        console.log('Creating new conversation for user ID:', numericUserId);
        // Create a new conversation object for this user
        const newConversation = {
          id: numericUserId,
          name: decodeURIComponent(userName),
          email: '', // We don't have email from URL params
          last_message: null,
          last_message_time: null
        };
        console.log('New conversation object:', newConversation);
        setSelectedConversation(newConversation);
        // Add to conversations list if not already there
        setConversations(prev => {
          const exists = prev.find(conv => conv.id === numericUserId);
          if (!exists) {
            return [newConversation, ...prev];
          }
          return prev;
        });
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [conversations]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) {
      console.log('Send message validation failed:', {
        newMessage: newMessage.trim(),
        selectedConversation
      });
      return;
    }
    
    if (!selectedConversation.id || isNaN(selectedConversation.id)) {
      console.error('Invalid receiver ID:', selectedConversation.id);
      toast.error('Invalid conversation selected');
      return;
    }
    
    try {
      setSendingMessage(true);
      
      const messageData = {
        receiver_id: selectedConversation.id,
        content: newMessage.trim()
      };
      
      console.log('Sending message:', messageData);
      console.log('Selected conversation:', selectedConversation);

      await axios.post('/api/messages', messageData);
      
      // Add message to local state immediately for better UX
      const tempMessage = {
        id: Date.now(),
        sender_id: user.id,
        receiver_id: selectedConversation.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender_name: user.name
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Update conversation list immediately with new message info and move to top
      const currentTime = new Date().toISOString();
      
      // Track this conversation as recently updated
      recentUpdatesRef.current.add(selectedConversation.id);
      
      setConversations(prev => {
        const updatedConversations = prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                last_message: newMessage.trim(),
                last_message_time: currentTime,
                _locallyUpdated: true // Mark as locally updated
              }
            : conv
        );
        
        // Sort to put the updated conversation at the top
        return updatedConversations.sort((a, b) => {
          if (a.id === selectedConversation.id) return -1;
          if (b.id === selectedConversation.id) return 1;
          if (a.last_message_time && b.last_message_time) {
            return new Date(b.last_message_time) - new Date(a.last_message_time);
          }
          return 0;
        });
      });
      
      // Clear the recent update tracking after some time
      setTimeout(() => {
        recentUpdatesRef.current.delete(selectedConversation.id);
      }, 5000);
      
      // No need to refresh messages immediately - the server has saved the message
      // and our local state is already updated correctly

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      toast.error(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
      <div className="bg-white rounded-2xl shadow-xl h-full flex overflow-hidden">
        
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white border border-transparent focus:border-purple-300"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p>No conversations found</p>
                <p className="text-sm mt-2">Join projects to start messaging with collaborators</p>
              </div>
            ) : (
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => {
                  // Get real-time status for this user
                  const userStatus = getUserStatus(conversation.id);
                  const isOnline = userStatus ? userStatus.is_online : conversation.is_online;
                  const lastActive = userStatus ? userStatus.last_active : conversation.last_active;
                  
                  return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-purple-50 border-l-4 border-l-purple-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {conversation.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {/* Real-time online status indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <OnlineStatusIndicator isOnline={isOnline} size="medium" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.name}
                            </h3>
                            {/* Real-time status text */}
                            <span className={`text-xs ${formatUserStatus(isOnline, lastActive).color}`}>
                              {formatUserStatus(isOnline, lastActive).text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {conversation.unread_count > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unread_count}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {conversation.last_message_time && formatTime(conversation.last_message_time)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {conversation.last_message || 'Start a conversation...'}
                        </p>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
          {!selectedConversation ? (
            // No conversation selected
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
                <p>Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {selectedConversation.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <OnlineStatusIndicator 
                        isOnline={getUserStatus(selectedConversation.id)?.is_online ?? selectedConversation.is_online} 
                        size="small" 
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                    <p className={`text-sm ${formatUserStatus(
                      getUserStatus(selectedConversation.id)?.is_online ?? selectedConversation.is_online, 
                      getUserStatus(selectedConversation.id)?.last_active ?? selectedConversation.last_active
                    ).color}`}>
                      {formatUserStatus(
                        getUserStatus(selectedConversation.id)?.is_online ?? selectedConversation.is_online, 
                        getUserStatus(selectedConversation.id)?.last_active ?? selectedConversation.last_active
                      ).text}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Info size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.keys(messageGroups).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-gray-400" />
                    </div>
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  Object.keys(messageGroups).map((dateKey) => (
                    <div key={dateKey}>
                      {/* Date Separator */}
                      <div className="flex items-center justify-center my-6">
                        <div className="bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-xs text-gray-600 font-medium">
                            {formatDate(dateKey)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Messages for this date */}
                      {messageGroups[dateKey].map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message.sender_id === user.id
                                ? 'bg-purple-600 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user.id ? 'text-purple-200' : 'text-gray-500'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex items-center space-x-3">
                  <button 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Paperclip size={20} className="text-gray-600" />
                  </button>
                  
                  <button 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Image size={20} className="text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white border border-transparent focus:border-purple-300"
                      disabled={sendingMessage}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Smile size={18} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
