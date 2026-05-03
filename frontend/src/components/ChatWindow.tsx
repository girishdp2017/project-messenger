import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, User } from '../types';
import { messageApi } from '../services/api';
import websocketService from '../services/websocket';
import './ChatWindow.css';

interface Props {
  conversation: Conversation;
  currentUser: User;
}

const ChatWindow: React.FC<Props> = ({ conversation, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await messageApi.getMessages(conversation.id);
        setMessages(response.data.content.reverse());
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
      setLoading(false);
    };

    loadMessages();

    websocketService.subscribeToConversation(conversation.id, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      websocketService.unsubscribeFromConversation(conversation.id);
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    websocketService.sendMessage(conversation.id, newMessage.trim());
    setNewMessage('');
  };

  const getOtherParticipants = (): string => {
    const others = conversation.participants.filter((p) => p.id !== currentUser.id);
    return others.map((p) => p.name).join(', ');
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateSeparator = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const shouldShowDateSeparator = (index: number): boolean => {
    if (index === 0) return true;
    const current = new Date(messages[index].timestamp).toDateString();
    const previous = new Date(messages[index - 1].timestamp).toDateString();
    return current !== previous;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>{conversation.name || getOtherParticipants()}</h3>
          <span className="participant-count">
            {conversation.participants.length} participant
            {conversation.participants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender.id === currentUser.id;

            return (
              <React.Fragment key={message.id}>
                {shouldShowDateSeparator(index) && (
                  <div className="date-separator">
                    <span>{formatDateSeparator(message.timestamp)}</span>
                  </div>
                )}
                <div
                  className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  {!isOwnMessage && (
                    <div className="message-avatar">
                      {message.sender.avatarUrl ? (
                        <img src={message.sender.avatarUrl} alt={message.sender.name} />
                      ) : (
                        <div className="msg-avatar-placeholder">
                          {message.sender.name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="message-bubble">
                    {!isOwnMessage && conversation.groupChat && (
                      <div className="message-sender-name">{message.sender.name}</div>
                    )}
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {formatTimestamp(message.timestamp)}
                      {message.edited && <span className="edited-tag"> (edited)</span>}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
