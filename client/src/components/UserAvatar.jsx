import React from 'react';
import { userAPI } from '../api/users';

const UserAvatar = ({ size = 'md', className = '', showName = false }) => {
  const currentUser = userAPI.getCurrentUser();
  const profileData = userAPI.getUserProfile();
  
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs';
      case 'md':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-base';
      case 'xl':
        return 'w-16 h-16 text-lg';
      case '2xl':
        return 'w-24 h-24 text-2xl';
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  const avatar = profileData?.avatar;
  const userName = currentUser?.name || 'User';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${getSizeClasses()} rounded-full overflow-hidden flex-shrink-0`}>
        {avatar ? (
          <img
            src={avatar}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
            {getInitials(userName)}
          </div>
        )}
      </div>
      {showName && (
        <span className="text-gray-700 font-medium">{userName}</span>
      )}
    </div>
  );
};

export default UserAvatar;
