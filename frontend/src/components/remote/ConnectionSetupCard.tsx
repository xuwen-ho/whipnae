"use client";

import { useState } from "react";
import { FiCopy, FiShare2, FiArrowLeft, FiUser } from "react-icons/fi";
import type { SavedConnection } from "@/lib/remote/types";

type ConnectionSetupCardProps = {
  userId: string;
  savedConnections: SavedConnection[];
  onBack: () => void;
  onConnect: (pin: string) => void;
  onReconnect: (connection: SavedConnection) => void;
};

export function ConnectionSetupCard({
  userId,
  savedConnections,
  onBack,
  onConnect,
  onReconnect,
}: ConnectionSetupCardProps) {
  const [pin, setPin] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Connect with me on Whipnae",
          text: `Use this PIN to connect with me: ${userId}`,
        });
      } catch (error) {
        // User cancelled or share failed
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to copy if Web Share API not supported
      handleCopyUserId();
    }
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      onConnect(pin.trim());
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
          aria-label="Go back"
        >
          <FiArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h3 className="text-lg font-semibold text-slate-900">Remote Connection Setup</h3>
      </div>

      {/* Connect to someone section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700">Connect to another user</label>
        <p className="mt-1 text-xs text-slate-500">Enter their PIN to request a connection</p>
        <form onSubmit={handleConnectSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            placeholder="Enter PIN (e.g., XYZ-123)"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            maxLength={10}
          />
          <button
            type="submit"
            disabled={!pin.trim()}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Connect
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-slate-400">OR</span>
        </div>
      </div>

      {/* Your User ID section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700">Your User ID</label>
        <p className="mt-1 text-xs text-slate-500">Share this PIN with someone to let them connect to you</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="font-mono text-lg font-semibold tracking-wider text-slate-900">{userId}</span>
          </div>
          <button
            onClick={handleCopyUserId}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white transition hover:bg-slate-50"
            aria-label="Copy User ID"
          >
            <FiCopy className={`h-5 w-5 ${copied ? "text-green-600" : "text-slate-600"}`} />
          </button>
          <button
            onClick={handleShare}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white transition hover:bg-slate-50"
            aria-label="Share User ID"
          >
            <FiShare2 className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-xs text-green-600">Copied to clipboard!</p>
        )}
      </div>

      {/* Previous connections section */}
      {savedConnections.length > 0 && (
        <div>
          <label className="text-sm font-medium text-slate-700">Previous Connections</label>
          <p className="mt-1 text-xs text-slate-500">Reconnect with people you&apos;ve helped before</p>
          <div className="mt-3 space-y-2">
            {savedConnections.map((connection) => (
              <button
                key={connection.id}
                onClick={() => onReconnect(connection)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <FiUser className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">{connection.userName}</p>
                  <p className="text-xs text-slate-500">
                    Last connected: {connection.lastConnected}
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600">Connect</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
