"use client";

import { FiUser, FiCheck, FiX } from "react-icons/fi";
import type { ConnectionRequest, Permission } from "@/lib/remote/types";
import { PERMISSION_LABELS } from "@/lib/remote/types";

type ConnectionRequestModalProps = {
  request: ConnectionRequest;
  onAccept: (permissions: Permission[]) => void;
  onDecline: () => void;
};

export function ConnectionRequestModal({
  request,
  onAccept,
  onDecline,
}: ConnectionRequestModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FiUser className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Connection Request</h3>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">{request.fromUserName}</span> wants to connect to your device
          </p>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <label className="text-sm font-medium text-slate-700">Requested Permissions</label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {request.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"
              >
                <div className="h-4 w-4 rounded border border-slate-300 bg-white flex items-center justify-center">
                  <FiCheck className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-slate-700">{PERMISSION_LABELS[permission]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 rounded-xl bg-amber-50 p-4">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> By accepting, they will be able to see and interact with your screen. 
            You can end the session at any time.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FiX className="h-4 w-4" />
            Decline
          </button>
          <button
            onClick={() => onAccept(request.permissions)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <FiCheck className="h-4 w-4" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
