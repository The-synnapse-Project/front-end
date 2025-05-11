// Real-time WebSocket client for attendance updates
import { toast } from "react-hot-toast";
import { EntryResponse } from "./api-client";

interface WebSocketMessage {
  type: "entry" | "permission" | "person" | "error" | string;
  data: any;
  timestamp: string;
}

// Event emitter for subscribers
type EventCallback = (data: any) => void;
type EventType = "entry" | "permission" | "person" | "connection" | "error";

class AttendanceWebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000; // 3 seconds
  private isConnecting: boolean = false;
  private eventListeners: Map<EventType, EventCallback[]> = new Map();
  private isActive: boolean = false;

  constructor(url?: string) {
    this.url = url || this.getWebSocketUrl();
  }

  // Convert HTTP(S) to WS(S)
  private getWebSocketUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return apiUrl.replace(/^http/, "ws") + "/ws";
  }

  // Connect to the WebSocket server
  public connect(): Promise<void> {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;
    this.isActive = true;

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log("WebSocket connection established");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.emit("connection", { status: "connected" });
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.socket.onclose = (event) => {
          this.isConnecting = false;
          console.log(
            `WebSocket connection closed: ${event.code} ${event.reason}`,
          );
          this.emit("connection", {
            status: "disconnected",
            code: event.code,
            reason: event.reason,
          });

          if (
            this.isActive &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), this.reconnectDelay);
          }
        };

        this.socket.onerror = (error) => {
          this.isConnecting = false;
          console.error("WebSocket error:", error);
          this.emit("error", { message: "WebSocket connection error" });
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        console.error("Error creating WebSocket:", error);
        reject(error);
      }
    });
  }

  // Disconnect from the WebSocket server
  public disconnect(): void {
    this.isActive = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "entry":
        this.emit("entry", message.data);
        break;
      case "permission":
        this.emit("permission", message.data);
        break;
      case "person":
        this.emit("person", message.data);
        break;
      case "error":
        this.emit("error", message.data);
        toast.error(
          `Real-time update error: ${message.data.message || "Unknown error"}`,
        );
        break;
      default:
        console.warn("Unknown WebSocket message type:", message);
    }
  }

  // Send a message to the server
  public send(type: string, data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: Partial<WebSocketMessage> = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  // Subscribe to events
  public on(eventType: EventType, callback: EventCallback): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)?.push(callback);
  }

  // Unsubscribe from events
  public off(eventType: EventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Emit an event to subscribers
  private emit(eventType: EventType, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Check if WebSocket is connected
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
const wsClient = new AttendanceWebSocketClient();

export default wsClient;
