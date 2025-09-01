import axios from 'axios';
import { getToken } from '../utils/auth';

class StatusService {
  constructor() {
    this.statusInterval = null;
    this.activityTimeout = null;
    this.isActive = true;
    this.lastActivityTime = new Date();
    
    // Set up axios defaults
    axios.defaults.baseURL = 'https://projectconnect-backend-azure-hgfacjfvfnbph0gf.eastasia-01.azurewebsites.net/api';
    this.setupAxiosInterceptors();
    
    // Track user activity
    this.setupActivityTracking();
  }

  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setupActivityTracking() {
    // Events that indicate user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];

    const updateActivity = () => {
      this.lastActivityTime = new Date();
      if (!this.isActive) {
        this.isActive = true;
        this.updateUserStatus();
      }
      
      // Reset the activity timeout
      if (this.activityTimeout) {
        clearTimeout(this.activityTimeout);
      }
      
      // Set user as inactive after 2 minutes of no activity
      this.activityTimeout = setTimeout(() => {
        this.isActive = false;
        this.updateUserStatus();
      }, 2 * 60 * 1000); // 2 minutes
    };

    // Add event listeners for activity tracking
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isActive = false;
        this.updateUserStatus();
      } else {
        updateActivity();
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.isActive = false;
      this.updateUserStatus();
    });
  }

  async updateUserStatus() {
    try {
      const token = getToken();
      if (!token) return;

      await axios.post('/api/users/update-status', {
        isActive: this.isActive,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  }

  async getUsersStatus(userIds = []) {
    try {
      const token = getToken();
      if (!token) return [];

      const response = await axios.post('/api/users/status', {
        userIds: userIds
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to get users status:', error);
      return [];
    }
  }

  startStatusTracking() {
    // Update our own status immediately
    this.updateUserStatus();
    
    // Set up periodic status updates every 30 seconds
    if (!this.statusInterval) {
      this.statusInterval = setInterval(() => {
        this.updateUserStatus();
      }, 30 * 1000); // 30 seconds
    }
  }

  stopStatusTracking() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
    
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }
    
    // Mark user as offline when stopping
    this.isActive = false;
    this.updateUserStatus();
  }

  // Get status for a specific user
  async getUserStatus(userId) {
    try {
      const token = getToken();
      if (!token) return null;

      const response = await axios.get(`/api/users/${userId}/status`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get user status:', error);
      return null;
    }
  }
}

// Create a singleton instance
const statusService = new StatusService();

export default statusService;
