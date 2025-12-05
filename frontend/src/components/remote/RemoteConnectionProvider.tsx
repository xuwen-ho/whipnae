"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type {
  Permission,
  SavedConnection,
  RemoteSessionState,
} from "@/lib/remote/types";
import { DEFAULT_PERMISSIONS } from "@/lib/remote/types";

// WebSocket server URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

// Generate a random user ID (in production, this would come from your auth system)
const generateUserId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 10)]).join("");
  return `${part1}-${part2}`;
};

// Use sessionStorage so each tab gets its own user ID
const getOrCreateUserId = (): string => {
  // Check sessionStorage first (per-tab)
  let userId = sessionStorage.getItem("whipnae-session-user-id");
  
  if (!userId) {
    // Generate new ID for this tab
    userId = generateUserId();
    sessionStorage.setItem("whipnae-session-user-id", userId);
  }
  
  return userId;
};

// Placeholder saved connections for demo
const PLACEHOLDER_CONNECTIONS: SavedConnection[] = [
  {
    id: "1",
    userId: "ABC-123",
    userName: "John Tan",
    lastConnected: "2 days ago",
  },
  {
    id: "2",
    userId: "XYZ-789",
    userName: "Mary Lim",
    lastConnected: "1 week ago",
  },
];

interface RemoteConnectionContextType {
  state: RemoteSessionState;
  isConnected: boolean;
  initializeSetup: () => void;
  cancelSetup: () => void;
  requestConnection: (targetUserId: string) => void;
  cancelConnectionRequest: () => void;
  acceptConnection: (permissions: Permission[]) => void;
  declineConnection: () => void;
  endSession: () => void;
  reconnect: (connection: SavedConnection) => void;
}

const RemoteConnectionContext = createContext<RemoteConnectionContextType | null>(null);

export function useRemoteConnection() {
  const context = useContext(RemoteConnectionContext);
  if (!context) {
    throw new Error("useRemoteConnection must be used within a RemoteConnectionProvider");
  }
  return context;
}

interface RemoteConnectionProviderProps {
  children: ReactNode;
}

export function RemoteConnectionProvider({ children }: RemoteConnectionProviderProps) {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [state, setState] = useState<RemoteSessionState>(() => ({
    status: "idle",
    userId: "",
    connectionRequest: null,
    activeConnection: null,
    savedConnections: PLACEHOLDER_CONNECTIONS,
  }));

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: Record<string, unknown>) => {
    console.log("Received WebSocket message:", data);
    
    switch (data.type) {
      case "connection_request":
        // Someone wants to connect to us
        setState((prev) => ({
          ...prev,
          status: "pending-approval",
          connectionRequest: {
            fromUserId: data.fromUserId as string,
            fromUserName: data.fromUserName as string,
            permissions: data.permissions as Permission[],
          },
        }));
        break;

      case "request_sent":
        console.log("Connection request sent to:", data.targetUserId);
        break;

      case "error":
        console.error("WebSocket error:", data.message);
        if (data.code === "USER_NOT_FOUND") {
          alert(`User is not online. Please check the PIN and try again.`);
          setState((prev) => ({
            ...prev,
            status: "setup",
            activeConnection: null,
          }));
        }
        break;

      case "connection_accepted":
        // Target accepted our connection request
        setState((prev) => ({
          ...prev,
          status: "connected-controlling",
          activeConnection: {
            remoteUserId: data.controlledUserId as string,
            remoteUserName: data.controlledUserName as string,
            isController: true,
            permissions: data.permissions as Permission[],
          },
        }));
        break;

      case "session_started":
        // We accepted a connection, session is now active
        setState((prev) => ({
          ...prev,
          status: "connected-controlled",
          activeConnection: {
            remoteUserId: data.controllerUserId as string,
            remoteUserName: data.controllerUserName as string,
            isController: false,
            permissions: DEFAULT_PERMISSIONS,
          },
        }));
        break;

      case "connection_declined":
        alert("Connection request was declined.");
        setState((prev) => ({
          ...prev,
          status: "setup",
          activeConnection: null,
        }));
        break;

      case "navigate":
        // Controller is navigating us
        if (data.path) {
          router.push(data.path as string);
        }
        break;

      case "session_ended":
        setState((prev) => ({
          ...prev,
          status: "idle",
          activeConnection: null,
        }));
        break;

      case "request_cancelled":
        setState((prev) => ({
          ...prev,
          status: "idle",
          connectionRequest: null,
        }));
        break;
    }
  }, [router]);

  // Initialize user ID from sessionStorage (per-tab) or generate new one
  useEffect(() => {
    const userId = getOrCreateUserId();
    setState((prev) => ({ ...prev, userId }));

    // Load saved connections from localStorage (shared across tabs)
    const savedConnections = localStorage.getItem("whipnae-saved-connections");
    if (savedConnections) {
      try {
        const connections = JSON.parse(savedConnections);
        setState((prev) => ({ ...prev, savedConnections: connections }));
      } catch (e) {
        console.error("Failed to load saved connections:", e);
      }
    }
  }, []);

  // Connect to WebSocket when userId is available
  useEffect(() => {
    if (!state.userId) return;

    const connectWebSocket = () => {
      const userName = localStorage.getItem("whipnae-user-name") || `User ${state.userId}`;
      const ws = new WebSocket(`${WS_URL}/ws/remote/${state.userId}?name=${encodeURIComponent(userName)}`);
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        wsRef.current = ws;
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [state.userId, handleWebSocketMessage]);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket not connected");
    }
  }, []);

  const initializeSetup = useCallback(() => {
    setState((prev) => ({ ...prev, status: "setup" }));
  }, []);

  const cancelSetup = useCallback(() => {
    setState((prev) => ({ ...prev, status: "idle" }));
  }, []);

  const requestConnection = useCallback((targetUserId: string) => {
    setState((prev) => ({
      ...prev,
      status: "connecting",
      activeConnection: {
        remoteUserId: targetUserId,
        remoteUserName: `User ${targetUserId}`,
        isController: true,
        permissions: DEFAULT_PERMISSIONS,
      },
    }));

    sendMessage({
      type: "connection_request",
      targetUserId,
      permissions: DEFAULT_PERMISSIONS,
    });
  }, [sendMessage]);

  const cancelConnectionRequest = useCallback(() => {
    if (state.activeConnection) {
      sendMessage({
        type: "cancel_request",
        targetUserId: state.activeConnection.remoteUserId,
      });
    }
    
    setState((prev) => ({
      ...prev,
      status: "setup",
      activeConnection: null,
    }));
  }, [sendMessage, state.activeConnection]);

  const acceptConnection = useCallback((permissions: Permission[]) => {
    if (!state.connectionRequest) return;

    sendMessage({
      type: "connection_accepted",
      requesterId: state.connectionRequest.fromUserId,
      permissions,
    });
  }, [sendMessage, state.connectionRequest]);

  const declineConnection = useCallback(() => {
    if (!state.connectionRequest) return;

    sendMessage({
      type: "connection_declined",
      requesterId: state.connectionRequest.fromUserId,
    });

    setState((prev) => ({
      ...prev,
      status: "idle",
      connectionRequest: null,
    }));
  }, [sendMessage, state.connectionRequest]);

  const endSession = useCallback(() => {
    // Save connection to history if we were the controller
    if (state.activeConnection?.isController) {
      const newConnection: SavedConnection = {
        id: Date.now().toString(),
        userId: state.activeConnection.remoteUserId,
        userName: state.activeConnection.remoteUserName,
        lastConnected: "Just now",
      };

      const updatedConnections = [
        newConnection,
        ...state.savedConnections.filter((c) => c.userId !== newConnection.userId),
      ].slice(0, 10);

      localStorage.setItem("whipnae-saved-connections", JSON.stringify(updatedConnections));

      setState((prev) => ({
        ...prev,
        savedConnections: updatedConnections,
      }));
    }

    sendMessage({ type: "end_session" });

    setState((prev) => ({
      ...prev,
      status: "idle",
      activeConnection: null,
    }));
  }, [sendMessage, state.activeConnection, state.savedConnections]);

  const reconnect = useCallback((connection: SavedConnection) => {
    requestConnection(connection.userId);
  }, [requestConnection]);

  return (
    <RemoteConnectionContext.Provider
      value={{
        state,
        isConnected,
        initializeSetup,
        cancelSetup,
        requestConnection,
        cancelConnectionRequest,
        acceptConnection,
        declineConnection,
        endSession,
        reconnect,
      }}
    >
      {children}
    </RemoteConnectionContext.Provider>
  );
}
