"use client";

import { FiLoader, FiX } from "react-icons/fi";

type ConnectingModalProps = {
  targetUserId: string;
  onCancel: () => void;
};

export function ConnectingModal({ targetUserId, onCancel }: ConnectingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        {/* Animated loader */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <FiLoader className="h-10 w-10 animate-spin text-green-600" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900">Connecting...</h3>
        <p className="mt-2 text-sm text-slate-500">
          Waiting for <span className="font-mono font-medium text-slate-700">{targetUserId}</span> to approve your request
        </p>

        {/* Dots animation */}
        <div className="mt-4 flex justify-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '0ms' }}></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '150ms' }}></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '300ms' }}></span>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FiX className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
