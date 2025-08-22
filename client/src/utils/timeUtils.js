// Time utility functions with Asia/Kolkata timezone support

// Format time for India timezone (Asia/Kolkata)
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  
  // Ensure we're working with a valid date
  if (isNaN(date.getTime())) {
    return 'Invalid time';
  }
  
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
};

// Format date for India timezone
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Ensure we're working with a valid date
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Convert dates to IST for comparison using proper timezone handling
  const dateIST = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const todayIST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const yesterdayIST = new Date(yesterday.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  if (dateIST.toDateString() === todayIST.toDateString()) {
    return 'Today';
  } else if (dateIST.toDateString() === yesterdayIST.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      timeZone: 'Asia/Kolkata'
    });
  }
};

// Format relative time (for notifications) with IST
export const formatRelativeTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Convert to IST for accurate comparison
  const dateIST = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const nowIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  const diffInMinutes = Math.floor((nowIST - dateIST) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// Format full date and time for IST
export const formatFullDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Get current IST time
export const getCurrentISTTime = () => {
  return new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Check if date is today in IST
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  
  const dateIST = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const todayIST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  return dateIST.toDateString() === todayIST.toDateString();
};
