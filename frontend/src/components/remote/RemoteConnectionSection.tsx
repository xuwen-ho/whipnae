"use client";

import { useRemoteConnection } from "./RemoteConnectionProvider";
import { RemoteAssistanceCard } from "./RemoteAssistanceCard";
import { ConnectionSetupCard } from "./ConnectionSetupCard";
import { ConnectionRequestModal } from "./ConnectionRequestModal";
import { ConnectingModal } from "./ConnectingModal";
import { RemoteSessionBorder } from "./RemoteSessionBorder";

export function RemoteConnectionSection() {
  const {
    state,
    initializeSetup,
    cancelSetup,
    requestConnection,
    cancelConnectionRequest,
    acceptConnection,
    declineConnection,
    endSession,
    reconnect,
  } = useRemoteConnection();

  return (
    <>
      {/* Main card - show either the initial card or the setup card */}
      {state.status === "idle" && (
        <RemoteAssistanceCard onInitialize={initializeSetup} />
      )}

      {state.status === "setup" && (
        <ConnectionSetupCard
          userId={state.userId}
          savedConnections={state.savedConnections}
          onBack={cancelSetup}
          onConnect={requestConnection}
          onReconnect={reconnect}
        />
      )}

      {/* Modals for connection flow */}
      {state.status === "connecting" && state.activeConnection && (
        <ConnectingModal
          targetUserId={state.activeConnection.remoteUserId}
          onCancel={cancelConnectionRequest}
        />
      )}

      {state.status === "pending-approval" && state.connectionRequest && (
        <ConnectionRequestModal
          request={state.connectionRequest}
          onAccept={acceptConnection}
          onDecline={declineConnection}
        />
      )}

      {/* Session border when connected */}
      {(state.status === "connected-controlling" || state.status === "connected-controlled") &&
        state.activeConnection && (
          <RemoteSessionBorder
            isController={state.activeConnection.isController}
            remoteUserName={state.activeConnection.remoteUserName}
            onEndSession={endSession}
          />
        )}
    </>
  );
}
