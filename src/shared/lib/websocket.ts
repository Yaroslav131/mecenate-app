import type { WsEvent } from '@/shared/types';

const WS_BASE =
  (process.env.EXPO_PUBLIC_WS_URL as string | undefined) ?? 'wss://k8s.mectest.ru/test-app/ws';

const AUTH_TOKEN = (process.env.EXPO_PUBLIC_AUTH_TOKEN as string | undefined) ?? '';

type Handler = (event: WsEvent) => void;

export type WsConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
type ConnectionStateHandler = (state: WsConnectionState) => void;

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers = new Set<Handler>();
  private connectionStateHandlers = new Set<ConnectionStateHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private active = false;
  private _connectionState: WsConnectionState = 'disconnected';

  get connectionState(): WsConnectionState {
    return this._connectionState;
  }

  connect() {
    this.active = true;
    this.reconnectAttempts = 0;
    this.open();
  }

  private setConnectionState(state: WsConnectionState) {
    this._connectionState = state;
    this.connectionStateHandlers.forEach((h) => h(state));
  }

  private open() {
    if (!this.active) return;
    this.setConnectionState('connecting');
    const url = `${WS_BASE}?token=${AUTH_TOKEN}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setConnectionState('connected');
    };

    this.ws.onmessage = (e) => {
      try {
        const event: WsEvent = JSON.parse(e.data as string);
        if (event.type === 'ping') {
          this.ws?.send(JSON.stringify({ type: 'pong' }));
          return;
        }
        this.handlers.forEach((h) => h(event));
      } catch {}
    };

    this.ws.onclose = () => {
      if (this.active) {
        this.setConnectionState('reconnecting');
        const delay = Math.min(RECONNECT_BASE_MS * 2 ** this.reconnectAttempts, RECONNECT_MAX_MS);
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => this.open(), delay);
      } else {
        this.setConnectionState('disconnected');
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  subscribe(handler: Handler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  onConnectionStateChange(handler: ConnectionStateHandler): () => void {
    this.connectionStateHandlers.add(handler);
    return () => this.connectionStateHandlers.delete(handler);
  }

  disconnect() {
    this.active = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
