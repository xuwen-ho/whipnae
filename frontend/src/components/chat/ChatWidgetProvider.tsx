'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatWidgetButton } from './ChatWidgetButton';
import { ChatWidgetPanel } from './ChatWidgetPanel';

type WidgetState = 'closed' | 'open' | 'minimized';

interface ChatWidgetContextType {
  // State
  widgetState: WidgetState;
  currentPage: string;
  pageName: string;
  
  // Chat state from useChat
  messages: UIMessage[];
  status: string;
  input: string;
  setInput: (value: string) => void;
  sendMessage: (message: { text: string }) => void;
  
  // Actions
  open: () => void;
  close: () => void;
  minimize: () => void;
  newChat: () => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | null>(null);

export function useChatWidget() {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
}

// Helper to get friendly page name from pathname
function getPageName(pathname: string): string {
  if (pathname === '/') return 'Home';
  if (pathname === '/chat') return 'Chat';
  if (pathname === '/profile') return 'Profile';
  if (pathname === '/profile/quiz') return 'Financial Quiz';
  
  // Convert /some-page to "Some Page"
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  
  return segments
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '))
    .join(' > ');
}

interface ChatWidgetProviderProps {
  children: ReactNode;
}

export function ChatWidgetProvider({ children }: ChatWidgetProviderProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>('closed');
  const [chatKey, setChatKey] = useState(0); // Used to reset chat
  const [input, setInput] = useState(''); // Manage input state separately
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  
  // Use the chat hook
  const { messages, sendMessage, status } = useChat({
    id: `chat-widget-${chatKey}`, // Change ID to reset chat
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onToolCall: async ({ toolCall }) => {
      console.log('🔧 [WIDGET] Tool call detected:', toolCall);
      return undefined;
    },
    onFinish: (result) => {
      console.log('🏁 [WIDGET] Chat finished:', result);
      
      if (result.finishReason === 'tool-calls') {
        console.log('⚠️ [WIDGET] Model stopped after tool calls - continuing...');
        setTimeout(() => {
          sendMessage({ text: '' });
        }, 100);
      }
    },
  });

  // Actions
  const open = useCallback(() => setWidgetState('open'), []);
  const close = useCallback(() => setWidgetState('closed'), []);
  const minimize = useCallback(() => setWidgetState('minimized'), []);
  const newChat = useCallback(() => {
    setChatKey(prev => prev + 1); // This will reset the chat
  }, []);

  const contextValue: ChatWidgetContextType = {
    widgetState,
    currentPage: pathname,
    pageName,
    messages,
    status,
    input,
    setInput,
    sendMessage,
    open,
    close,
    minimize,
    newChat,
  };

  return (
    <ChatWidgetContext.Provider value={contextValue}>
      {children}
      
      {/* Render widget UI */}
      {widgetState === 'open' && <ChatWidgetPanel />}
      {(widgetState === 'closed' || widgetState === 'minimized') && (
        <ChatWidgetButton hasMessages={messages.length > 0} />
      )}
    </ChatWidgetContext.Provider>
  );
}
