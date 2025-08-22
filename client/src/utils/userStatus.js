// Utility function to format user status based on last activity
export const formatUserStatus = (isOnline, lastActive) => {
  if (isOnline) {
    return { text: 'Online', color: 'text-green-500' };
  }
  
  if (!lastActive) {
    return { text: 'Offline', color: 'text-gray-500' };
  }
  
  const now = new Date();
  const lastActiveDate = new Date(lastActive);
  
  // Convert both dates to IST for accurate calculation
  const nowIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const lastActiveIST = new Date(lastActiveDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  const diffInSeconds = Math.floor((nowIST - lastActiveIST) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return { text: 'Just now', color: 'text-yellow-500' };
  } else if (diffInMinutes < 60) {
    return { 
      text: `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`, 
      color: 'text-yellow-500' 
    };
  } else if (diffInHours < 24) {
    return { 
      text: `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`, 
      color: 'text-orange-500' 
    };
  } else if (diffInDays < 7) {
    return { 
      text: `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`, 
      color: 'text-red-500' 
    };
  } else {
    return { 
      text: lastActiveIST.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }), 
      color: 'text-gray-500' 
    };
  }
};

// Online status indicator component
export const OnlineStatusIndicator = ({ isOnline, size = 'small' }) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
  );
};
