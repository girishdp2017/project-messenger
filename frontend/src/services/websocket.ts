import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../types';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, { id: string }> = new Map();

  connect(onConnect?: () => void): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        if (onConnect) onConnect();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    this.client.activate();
  }

  subscribeToConversation(
    conversationId: number,
    onMessage: (message: Message) => void
  ): void {
    if (!this.client || !this.client.connected) return;

    const destination = `/topic/conversation.${conversationId}`;
    if (this.subscriptions.has(destination)) return;

    const subscription = this.client.subscribe(destination, (msg: IMessage) => {
      const message: Message = JSON.parse(msg.body);
      onMessage(message);
    });

    this.subscriptions.set(destination, subscription);
  }

  unsubscribeFromConversation(conversationId: number): void {
    const destination = `/topic/conversation.${conversationId}`;
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      this.client?.unsubscribe(subscription.id);
      this.subscriptions.delete(destination);
    }
  }

  sendMessage(conversationId: number, content: string): void {
    if (!this.client || !this.client.connected) return;

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ conversationId, content }),
    });
  }

  sendTyping(conversationId: number): void {
    if (!this.client || !this.client.connected) return;

    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({ conversationId }),
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscriptions.clear();
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

const websocketService = new WebSocketService();
export default websocketService;
