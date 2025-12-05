export type ConnectionStatus = 
  | 'idle'
  | 'setup'
  | 'connecting'
  | 'pending-approval'
  | 'connected-controlling'
  | 'connected-controlled';

export type Permission = 
  | 'view'
  | 'navigate'
  | 'interact'
  | 'chat';

export interface SavedConnection {
  id: string;
  userId: string;
  userName: string;
  lastConnected: string;
}

export interface ConnectionRequest {
  fromUserId: string;
  fromUserName: string;
  permissions: Permission[];
}

export interface RemoteSessionState {
  status: ConnectionStatus;
  userId: string;
  connectionRequest: ConnectionRequest | null;
  activeConnection: {
    remoteUserId: string;
    remoteUserName: string;
    isController: boolean;
    permissions: Permission[];
  } | null;
  savedConnections: SavedConnection[];
}

export const DEFAULT_PERMISSIONS: Permission[] = ['view', 'navigate', 'interact', 'chat'];

export const PERMISSION_LABELS: Record<Permission, string> = {
  view: 'View Screen',
  navigate: 'Navigate Pages',
  interact: 'Click & Interact',
  chat: 'Access Chat',
};
