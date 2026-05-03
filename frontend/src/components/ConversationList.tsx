import React from 'react';
import { Conversation, User } from '../types';
import './ConversationList.css';

interface Props {
  conversations: Conversation[];
  currentUser: User;
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<Props> = ({
  conversations,
  currentUser,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
}) => {
  const getConversationDisplayName = (conversation: Conversation): string => {
    if (conversation.name) return conversation.name;
    const otherParticipants = conversation.participants.filter(
      (p) => p.id !== currentUser.id
    );
    return otherParticipants.map((p) => p.name).join(', ') || 'Unknown';
  };

  const getConversationAvatar = (conversation: Conversation): string | null => {
    if (conversation.groupChat) return null;
    const other = conversation.participants.find((p) => p.id !== currentUser.id);
    return other?.avatarUrl || null;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Chats</h2>
        <button className="new-chat-btn" onClick={onNewConversation} title="New conversation">
          +
        </button>
      </div>

      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
            <button onClick={onNewConversation}>Start a new chat</button>
          </div>
        ) : (
          conversations.map((conversation) => {
            const displayName = getConversationDisplayName(conversation);
            const avatar = getConversationAvatar(conversation);
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <div
                key={conversation.id}
                className={`conversation-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="conversation-avatar">
                  {avatar ? (
                    <img src={avatar} alt={displayName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(displayName)}
                    </div>
                  )}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{displayName}</div>
                  <div className="conversation-meta">
                    {conversation.groupChat && (
                      <span className="group-badge">Group</span>
                    )}
                    <span className="conversation-time">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
