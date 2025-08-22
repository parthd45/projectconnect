import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, X } from 'lucide-react';
import useMessageNotifications from '../hooks/useMessageNotifications';
import { formatUserStatus, OnlineStatusIndicator } from '../utils/userStatus';
import { formatRelativeTime } from '../utils/timeUtils';

const MessageNotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, notifications, markAsRead } = useMessageNotifications();

  const handleNotificationClick = async (notification) => {
    // Mark messages from this sender as read
    await markAsRead(notification.sender_id);
    
    // Navigate to messages page with this user selected
    navigate(`/messages?user=${notification.sender_id}&name=${encodeURIComponent(notification.sender_name)}`);
    
    // Close dropdown
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors relative hover:bg-gray-100 rounded-lg" 
        style={{color: 'var(--text-muted)'}}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <MessageCircle size={18} className="mr-2 text-blue-600" />
                New Messages
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageCircle size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No new messages</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Avatar with status indicator */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {notification.sender_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <OnlineStatusIndicator isOnline={notification.sender_is_online} size="small" />
                          </div>
                        </div>
                        
                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {notification.sender_name}
                              </p>
                              <span className={`text-xs ${formatUserStatus(notification.sender_is_online, notification.last_active).color}`}>
                                {formatUserStatus(notification.sender_is_online, notification.last_active).text}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    navigate('/messages');
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Messages
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageNotificationDropdown;
