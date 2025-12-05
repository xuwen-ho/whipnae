"use client";

import { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";

type RemoteAssistanceCardProps = {
  onInitialize: () => void;
};

export function RemoteAssistanceCard({ onInitialize }: RemoteAssistanceCardProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const handleHighlight = (event: CustomEvent<{ elementId: string; message?: string }>) => {
      if (event.detail.elementId === 'remote-connection') {
        console.log('✨ [RemoteAssistanceCard] Received highlight event');
        setIsFlashing(true);
        
        // Stop flashing after ~2.8 seconds (8 pulses at 350ms each)
        setTimeout(() => {
          setIsFlashing(false);
        }, 2800);
      }
    };

    window.addEventListener('highlight-ui-element', handleHighlight as EventListener);
    return () => {
      window.removeEventListener('highlight-ui-element', handleHighlight as EventListener);
    };
  }, []);

  return (
    <>
      {/* Global CSS for the flash animation */}
      <style>{`
        @keyframes highlight-flash {
          0%, 100% { background-color: white; }
          50% { background-color: rgb(209 213 219); }
        }
        .highlight-flash-animation {
          animation: highlight-flash 0.35s ease-in-out 8;
          border: 3px solid rgb(96 165 250) !important; /* blue-400 */
          box-shadow: 0 0 12px rgba(96, 165, 250, 0.5);
        }
        @media (prefers-reduced-motion: reduce) {
          .highlight-flash-animation {
            animation: none;
            background-color: rgb(209 213 219);
          }
        }
      `}</style>
      <div 
        className={`rounded-3xl p-6 shadow-sm transition-all duration-200 ${
          isFlashing ? 'highlight-flash-animation' : 'bg-white border-3 border-transparent'
        }`}
      >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
          <FiUsers className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">Remote Assistance</h3>
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
    </>
  );
}
