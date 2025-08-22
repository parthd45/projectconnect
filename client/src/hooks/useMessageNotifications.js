import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';

const useMessageNotifications = () => {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get('/api/messages/unread-count');
      setUnreadCount(response.data.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/notifications');
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (senderId) => {
    try {
      await axios.put(`/api/messages/mark-read/${senderId}`);
      // Refresh counts
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const [unreadResponse, notificationsResponse] = await Promise.all([
          axios.get('/api/messages/unread-count'),
          axios.get('/api/messages/notifications')
        ]);
        
        setUnreadCount(unreadResponse.data.data.unread_count);
        setNotifications(notificationsResponse.data.data.notifications);
      } catch (error) {
        console.error('Error fetching message data:', error);
      }
    };
    
    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead
  };
};

export default useMessageNotifications;
