import { useEffect, useRef } from 'react';

// Hook to automatically refresh conversations for real-time status updates
const useRealtimeStatusUpdates = (fetchConversations, intervalMs = 60000) => {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    // Set up periodic refresh for status updates
    intervalRef.current = setInterval(() => {
      if (fetchConversations) {
        fetchConversations();
      }
    }, intervalMs);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchConversations, intervalMs]);
  
  // Method to force immediate refresh
  const refreshNow = () => {
    if (fetchConversations) {
      fetchConversations();
    }
  };
  
  return { refreshNow };
};

export default useRealtimeStatusUpdates;
