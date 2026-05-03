import axios from 'axios';
import { User, Conversation, Message, ConversationRequest } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const authApi = {
  getCurrentUser: () => api.get<User>('/api/auth/user'),
  getAuthStatus: () => api.get<{ authenticated: boolean }>('/api/auth/status'),
  getLoginUrl: (provider: string) => `${API_BASE}/oauth2/authorization/${provider}`,
  getLogoutUrl: () => `${API_BASE}/logout`,
};

export const userApi = {
  getAllUsers: () => api.get<User[]>('/api/users'),
  searchUsers: (query: string) => api.get<User[]>(`/api/users/search?query=${query}`),
  getOnlineUsers: () => api.get<User[]>('/api/users/online'),
  getUserById: (id: number) => api.get<User>(`/api/users/${id}`),
};

export const conversationApi = {
  getConversations: () => api.get<Conversation[]>('/api/conversations'),
  createConversation: (request: ConversationRequest) =>
    api.post<Conversation>('/api/conversations', request),
  getConversation: (id: number) => api.get<Conversation>(`/api/conversations/${id}`),
};

export const messageApi = {
  getMessages: (conversationId: number, page: number = 0, size: number = 50) =>
    api.get<{ content: Message[] }>(`/api/messages/conversation/${conversationId}?page=${page}&size=${size}`),
};

export default api;
