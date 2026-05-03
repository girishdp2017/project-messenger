import React from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import './UserProfile.css';

interface Props {
  user: User;
}

const UserProfile: React.FC<Props> = ({ user }) => {
  return (
    <div className="user-profile">
      <div className="profile-avatar">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.name[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="profile-info">
        <span className="profile-name">{user.name}</span>
      </div>
      <a href={authApi.getLogoutUrl()} className="logout-btn" title="Logout">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      </a>
    </div>
  );
};

export default UserProfile;
