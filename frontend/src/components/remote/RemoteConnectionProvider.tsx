"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type {
  ConnectionStatus,
  Permission,
  SavedConnection,
  ConnectionRequest,
  RemoteSessionState,
} from "@/lib/remote/types";
import { DEFAULT_PERMISSIONS } from "@/lib/remote/types";

// Generate a random user ID (in production, this would come from your auth system)
const generateUserId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 10)]).join("");
  return `${part1}-${part2}`;
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
  initializeSetup: () => void;
  cancelSetup: () => void;
  requestConnection: (targetUserId: string) => void;
  cancelConnectionRequest: () => void;
  acceptConnection: (permissions: Permission[]) => void;
  declineConnection: () => void;
  endSession: () => void;
  reconnect: (connection: SavedConnection) => void;
  // Simulated functions for demo
  simulateIncomingRequest: () => void;
  simulateConnectionApproved: () => void;
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
  const [state, setState] = useState<RemoteSessionState>(() => ({
    status: "idle",
    userId: "",
    connectionRequest: null,
    activeConnection: null,
    savedConnections: PLACEHOLDER_CONNECTIONS,
  }));

  // Initialize user ID from localStorage or generate new one
  useEffect(() => {
    const savedUserId = localStorage.getItem("whipnae-user-id");
    if (savedUserId) {
      setState((prev) => ({ ...prev, userId: savedUserId }));
    } else {
      const newUserId = generateUserId();
      localStorage.setItem("whipnae-user-id", newUserId);
      setState((prev) => ({ ...prev, userId: newUserId }));
    }

    // Load saved connections
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

    // In production, this would send a request to your backend
    // For demo, we'll simulate the approval after a delay
  }, []);

  const cancelConnectionRequest = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "setup",
      activeConnection: null,
    }));
  }, []);

  const acceptConnection = useCallback((permissions: Permission[]) => {
    if (!state.connectionRequest) return;

    setState((prev) => ({
      ...prev,
      status: "connected-controlled",
      connectionRequest: null,
      activeConnection: {
        remoteUserId: prev.connectionRequest!.fromUserId,
        remoteUserName: prev.connectionRequest!.fromUserName,
        isController: false,
        permissions,
      },
    }));
  }, [state.connectionRequest]);

  const declineConnection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "idle",
      connectionRequest: null,
    }));
  }, []);

  const endSession = useCallback(() => {
    // Save connection to history if we were the controller
    if (state.activeConnection?.isController) {
      const newConnection: SavedConnection = {
        id: Date.now().toString(),
        userId: state.activeConnection.remoteUserId,
        userName: state.activeConnection.remoteUserName,
        lastConnected: "Just now",
      };

      setState((prev) => {
        const updatedConnections = [
          newConnection,
          ...prev.savedConnections.filter((c) => c.userId !== newConnection.userId),
        ].slice(0, 10); // Keep only last 10 connections

        localStorage.setItem("whipnae-saved-connections", JSON.stringify(updatedConnections));

        return {
          ...prev,
          status: "idle",
          activeConnection: null,
          savedConnections: updatedConnections,
        };
      });
    } else {
      setState((prev) => ({
        ...prev,
        status: "idle",
        activeConnection: null,
      }));
    }
  }, [state.activeConnection]);

  const reconnect = useCallback((connection: SavedConnection) => {
    requestConnection(connection.userId);
  }, [requestConnection]);

  // Demo functions to simulate real-time events
  const simulateIncomingRequest = useCallback(() => {
    const request: ConnectionRequest = {
      fromUserId: "DEF-456",
      fromUserName: "Demo Helper",
      permissions: DEFAULT_PERMISSIONS,
    };

    setState((prev) => ({
      ...prev,
      status: "pending-approval",
      connectionRequest: request,
    }));
  }, []);

  const simulateConnectionApproved = useCallback(() => {
    if (state.status !== "connecting" || !state.activeConnection) return;

    setState((prev) => ({
      ...prev,
      status: "connected-controlling",
    }));
  }, [state.status, state.activeConnection]);

  return (
    <RemoteConnectionContext.Provider
      value={{
        state,
        initializeSetup,
        cancelSetup,
        requestConnection,
        cancelConnectionRequest,
        acceptConnection,
        declineConnection,
        endSession,
        reconnect,
        simulateIncomingRequest,
        simulateConnectionApproved,
      }}
    >
      {children}
    </RemoteConnectionContext.Provider>
  );
}
