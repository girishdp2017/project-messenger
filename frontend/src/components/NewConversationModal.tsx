import React, { useState, useEffect } from 'react';
import { User, ConversationRequest } from '../types';
import { userApi } from '../services/api';
import './NewConversationModal.css';

interface Props {
  currentUser: User;
  onClose: () => void;
  onCreateConversation: (request: ConversationRequest) => void;
}

const NewConversationModal: React.FC<Props> = ({
  currentUser,
  onClose,
  onCreateConversation,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data.filter((u) => u.id !== currentUser.id));
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, [currentUser.id]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.find((s) => s.id === user.id)
  );

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.find((s) => s.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreate = () => {
    if (selectedUsers.length === 0) return;

    const request: ConversationRequest = {
      name: isGroup ? groupName || null : null,
      participantIds: selectedUsers.map((u) => u.id),
      groupChat: isGroup || selectedUsers.length > 1,
    };

    onCreateConversation(request);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Conversation</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="conversation-type-toggle">
            <button
              className={`type-btn ${!isGroup ? 'active' : ''}`}
              onClick={() => setIsGroup(false)}
            >
              Direct Message
            </button>
            <button
              className={`type-btn ${isGroup ? 'active' : ''}`}
              onClick={() => setIsGroup(true)}
            >
              Group Chat
            </button>
          </div>

          {isGroup && (
            <input
              type="text"
              className="group-name-input"
              placeholder="Group name (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          )}

          <input
            type="text"
            className="user-search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {selectedUsers.length > 0 && (
            <div className="selected-users">
              {selectedUsers.map((user) => (
                <span key={user.id} className="selected-user-chip">
                  {user.name}
                  <button onClick={() => toggleUserSelection(user)}>&times;</button>
                </span>
              ))}
            </div>
          )}

          <div className="user-list">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="user-list-item"
                onClick={() => toggleUserSelection(user)}
              >
                <div className="user-list-avatar">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  {user.online && <span className="online-dot" />}
                </div>
                <div className="user-list-info">
                  <span className="user-list-name">{user.name}</span>
                  <span className="user-list-email">{user.email}</span>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="no-users">No users found</div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={selectedUsers.length === 0}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
