import { useState, useEffect, useCallback, useRef } from 'react';
import statusService from '../services/statusService';

const useRealtimeUserStatus = (userIds = [], intervalMs = 30000) => {
  const [usersStatus, setUsersStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  const fetchUsersStatus = useCallback(async () => {
    if (!userIds.length || !isActiveRef.current) return;
    
    try {
      setLoading(true);
      const statusData = await statusService.getUsersStatus(userIds);
      setUsersStatus(statusData);
    } catch (error) {
      console.error('Failed to fetch users status:', error);
    } finally {
      setLoading(false);
    }
  }, [userIds]);

  useEffect(() => {
    // Start status service when component mounts
    statusService.startStatusTracking();
    
    // Initial fetch
    if (userIds.length > 0) {
      fetchUsersStatus();
    }

    // Set up interval for periodic updates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current && userIds.length > 0) {
        fetchUsersStatus();
      }
    }, intervalMs);

    // Cleanup on unmount
    return () => {
      isActiveRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUsersStatus, intervalMs, userIds]);

  // Handle page visibility to pause/resume updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      if (!document.hidden && userIds.length > 0) {
        fetchUsersStatus(); // Fetch immediately when page becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUsersStatus, userIds]);

  const getUserStatus = useCallback((userId) => {
    return usersStatus.find(user => user.id === parseInt(userId));
  }, [usersStatus]);

  const refreshStatus = useCallback(() => {
    fetchUsersStatus();
  }, [fetchUsersStatus]);

  return {
    usersStatus,
    loading,
    getUserStatus,
    refreshStatus
  };
};

export default useRealtimeUserStatus;
