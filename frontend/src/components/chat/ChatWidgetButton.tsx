'use client';

import { useChatWidget } from './ChatWidgetProvider';

interface ChatWidgetButtonProps {
  hasMessages?: boolean;
}

export function ChatWidgetButton({ hasMessages = false }: ChatWidgetButtonProps) {
  const { open, widgetState } = useChatWidget();
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chat-pulse-glow {
          0%, 100% { opacity: 0.6; filter: blur(8px); }
          50% { opacity: 1; filter: blur(12px); }
        }
        @keyframes chat-brain-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 16px rgba(139, 92, 246, 0.9)); }
        }
        @keyframes chat-ring-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-animate { animation: none !important; }
        }
      `}} />
      
      <button
        onClick={open}
        className="group fixed bottom-24 right-6 z-40 flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label={widgetState === 'minimized' ? 'Restore chat' : 'Open chat assistant'}
        style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))' }}
      >
        {/* Outer glow effect */}
        <div 
          className="chat-animate absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            animation: 'chat-pulse-glow 3s ease-in-out infinite',
            transform: 'scale(1.5)',
          }}
        />

        {/* Gradient ring */}
        <svg 
          className="chat-animate absolute"
          style={{
            width: '90px',
            height: '90px',
            animation: 'chat-ring-pulse 3s ease-in-out infinite',
          }}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Main gradient ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="6"
            filter="url(#glow-filter)"
            opacity="0.9"
          />
          {/* Inner subtle ring */}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>

        {/* Center dark circle */}
        <div 
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: '56px',
            height: '56px',
            background: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 50%, #020617 100%)',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          {/* Brain icon */}
          <svg 
            className="chat-animate"
            style={{
              width: '28px',
              height: '28px',
              animation: 'chat-brain-pulse 3s ease-in-out infinite',
            }}
            viewBox="0 0 24 24" 
            fill="none"
          >
            <defs>
              <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9C4 10.5 5 11.5 5.5 12C4.5 13 4 14.5 4 16C4 18.5 6 20 8 20C8 21.5 9.5 22 11 22H13C14.5 22 16 21.5 16 20C18 20 20 18.5 20 16C20 14.5 19.5 13 18.5 12C19 11.5 20 10.5 20 9C20 7 18.5 5.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
              stroke="url(#brain-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M12 2V22M8 6C9 7 9 9 8 10M16 6C15 7 15 9 16 10M7 14C8 13 8 15 7 16M17 14C16 13 16 15 17 16"
              stroke="url(#brain-gradient)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Notification dot when minimized with messages */}
        {hasMessages && widgetState === 'minimized' && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </span>
        )}
      </button>
    </>
  );
}
