export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  online: boolean;
}

export interface Conversation {
  id: number;
  name: string | null;
  groupChat: boolean;
  createdAt: string;
  updatedAt: string;
  participants: User[];
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: User;
  conversationId: number;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'SYSTEM';
  edited: boolean;
}

export interface MessageRequest {
  conversationId: number;
  content: string;
}

export interface ConversationRequest {
  name: string | null;
  participantIds: number[];
  groupChat: boolean;
}
