"use client";

import { FiX, FiUser, FiEye, FiNavigation } from "react-icons/fi";

type RemoteSessionBorderProps = {
  isController: boolean;
  remoteUserName: string;
  onEndSession: () => void;
};

export function RemoteSessionBorder({
  isController,
  remoteUserName,
  onEndSession,
}: RemoteSessionBorderProps) {
  const borderColor = isController ? "border-green-500" : "border-red-500";
  const bgColor = isController ? "bg-green-500" : "bg-red-500";
  const statusText = isController ? "Controlling" : "Being Controlled";
  const Icon = isController ? FiNavigation : FiEye;

  return (
    <>
      {/* Top, bottom, left, right borders */}
      <div className={`fixed inset-x-0 top-0 z-[100] h-1 ${bgColor}`} />
      <div className={`fixed inset-x-0 bottom-0 z-[100] h-1 ${bgColor}`} />
      <div className={`fixed inset-y-0 left-0 z-[100] w-1 ${bgColor}`} />
      <div className={`fixed inset-y-0 right-0 z-[100] w-1 ${bgColor}`} />

      {/* Status bar at bottom */}
      <div className={`fixed inset-x-0 bottom-1 z-[100] flex justify-center px-4 pb-safe`}>
        <div className={`flex items-center gap-3 rounded-full ${bgColor} px-4 py-2 shadow-lg`}>
          <Icon className="h-4 w-4 text-white" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white">{statusText}:</span>
            <div className="flex items-center gap-1">
              <FiUser className="h-3 w-3 text-white/80" />
              <span className="text-xs font-semibold text-white">{remoteUserName}</span>
            </div>
          </div>
          <button
            onClick={onEndSession}
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
            aria-label="End session"
          >
            <FiX className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
