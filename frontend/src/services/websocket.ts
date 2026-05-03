import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../types';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

interface SubscriptionInfo {
  id: string;
  destination: string;
  callback: (message: Message) => void;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, SubscriptionInfo> = new Map();

  connect(onConnect?: () => void): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        this.resubscribeAll();
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

  private resubscribeAll(): void {
    if (!this.client || !this.client.connected) return;

    const entries = Array.from(this.subscriptions.entries());
    this.subscriptions.clear();

    for (const [destination, info] of entries) {
      const subscription = this.client.subscribe(destination, (msg: IMessage) => {
        const message: Message = JSON.parse(msg.body);
        info.callback(message);
      });
      this.subscriptions.set(destination, {
        id: subscription.id,
        destination,
        callback: info.callback,
      });
    }
  }

  subscribeToConversation(
    conversationId: number,
    onMessage: (message: Message) => void
  ): void {
    const destination = `/topic/conversation.${conversationId}`;

    if (this.subscriptions.has(destination)) return;

    const info: SubscriptionInfo = {
      id: '',
      destination,
      callback: onMessage,
    };

    if (this.client && this.client.connected) {
      const subscription = this.client.subscribe(destination, (msg: IMessage) => {
        const message: Message = JSON.parse(msg.body);
        onMessage(message);
      });
      info.id = subscription.id;
    }

    this.subscriptions.set(destination, info);
  }

  unsubscribeFromConversation(conversationId: number): void {
    const destination = `/topic/conversation.${conversationId}`;
    const info = this.subscriptions.get(destination);
    if (info) {
      if (info.id && this.client) {
        this.client.unsubscribe(info.id);
      }
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
