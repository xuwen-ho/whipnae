"use client";

import { FiUsers } from "react-icons/fi";

type RemoteAssistanceCardProps = {
  onInitialize: () => void;
};

export function RemoteAssistanceCard({ onInitialize }: RemoteAssistanceCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
          <FiUsers className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">Invite a Trusted Helper</h3>
          <p className="mt-1 text-sm text-slate-500">
            Help family members or friends navigate the app, or get assistance from someone you trust.
          </p>
          <button
            type="button"
            onClick={onInitialize}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Initialize Remote Connection
          </button>
        </div>
      </div>
    </div>
  );
}
