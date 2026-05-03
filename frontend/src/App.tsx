import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import NewConversationModal from './components/NewConversationModal';
import UserProfile from './components/UserProfile';
import { authApi, conversationApi } from './services/api';
import websocketService from './services/websocket';
import { User, Conversation, ConversationRequest } from './types';
import './App.css';

const MessengerApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    try {
      const response = await conversationApi.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setCurrentUser(response.data);
        websocketService.connect(() => {
          loadConversations();
        });
      } catch (error) {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    return () => {
      websocketService.disconnect();
    };
  }, [loadConversations]);

  const handleCreateConversation = async (request: ConversationRequest) => {
    try {
      const response = await conversationApi.createConversation(request);
      setConversations((prev) => [response.data, ...prev]);
      setSelectedConversation(response.data);
      setShowNewConversation(false);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="messenger-app">
      <div className="sidebar">
        <ConversationList
          conversations={conversations}
          currentUser={currentUser}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onNewConversation={() => setShowNewConversation(true)}
        />
        <UserProfile user={currentUser} />
      </div>

      <div className="main-content">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h2>Project Messenger</h2>
              <p>Select a conversation or start a new one</p>
              <button onClick={() => setShowNewConversation(true)}>
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {showNewConversation && (
        <NewConversationModal
          currentUser={currentUser}
          onClose={() => setShowNewConversation(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<MessengerApp />} />
      </Routes>
    </Router>
  );
}

export default App;
