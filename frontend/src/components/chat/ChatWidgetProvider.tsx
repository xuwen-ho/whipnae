'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

// Mapping of element IDs to their target pages
const ELEMENT_PAGE_MAP: Record<string, string> = {
  'remote-connection': '/profile',
};

export function ChatWidgetProvider({ children }: ChatWidgetProviderProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>('closed');
  const [chatKey, setChatKey] = useState(0); // Used to reset chat
  const [input, setInput] = useState(''); // Manage input state separately
  const [processedToolCalls, setProcessedToolCalls] = useState<Set<string>>(new Set()); // Track processed tool calls
  const pathname = usePathname();
  const router = useRouter();
  const pageName = getPageName(pathname);
  
  // Use the chat hook
  const { messages, sendMessage, status } = useChat({
    id: `chat-widget-${chatKey}`, // Change ID to reset chat
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onToolCall: ({ toolCall }) => {
      console.log('🔧 [WIDGET] Tool call detected:', toolCall);
      
      // Handle UI highlighting tool on the frontend
      if (toolCall.toolName === 'highlightUIElement') {
        const args = toolCall.input as { elementId: string; message?: string };
        console.log('🎯 [WIDGET] Dispatching highlight event for:', args.elementId);
        
        // Check if we need to navigate to a different page first
        const targetPage = ELEMENT_PAGE_MAP[args.elementId];
        if (targetPage && pathname !== targetPage) {
          console.log('🧭 [WIDGET] Navigating to', targetPage, 'before highlighting');
          router.push(targetPage);
          // Delay the highlight event to allow navigation to complete, then scroll to bottom
          setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            window.dispatchEvent(new CustomEvent('highlight-ui-element', {
              detail: { elementId: args.elementId, message: args.message }
            }));
          }, 500);
        } else {
          // Already on the correct page, dispatch immediately
          window.dispatchEvent(new CustomEvent('highlight-ui-element', {
            detail: { elementId: args.elementId, message: args.message }
          }));
        }
      }
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

  // Watch messages for highlightUIElement tool invocations (since onToolCall doesn't fire for server-executed tools)
  useEffect(() => {
    // Check the latest message for tool invocations
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'assistant') return;

    for (const part of latestMessage.parts) {
      // Tool parts have type like 'tool-invocation' or 'tool-highlightUIElement'
      // Cast to any to access the tool properties since the types are complex
      const toolPart = part as any;
      
      if (toolPart.type?.startsWith('tool-') && toolPart.toolName === 'highlightUIElement') {
        // Create a unique ID for this tool call to prevent duplicate processing
        const toolCallId = toolPart.toolCallId || `${latestMessage.id}-${toolPart.toolName}`;
        
        if (processedToolCalls.has(toolCallId)) {
          continue; // Already processed this tool call
        }
        
        const args = (toolPart.args || toolPart.input) as { elementId: string; message?: string };
        console.log('🎯 [WIDGET] Detected highlightUIElement in message stream:', args);
        
        // Mark as processed
        setProcessedToolCalls(prev => new Set(prev).add(toolCallId));
        
        // Check if we need to navigate to a different page first
        const targetPage = ELEMENT_PAGE_MAP[args.elementId];
        if (targetPage && pathname !== targetPage) {
          console.log('🧭 [WIDGET] Navigating to', targetPage, 'before highlighting');
          router.push(targetPage);
          // Delay the highlight event to allow navigation to complete, then scroll to bottom
          setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            window.dispatchEvent(new CustomEvent('highlight-ui-element', {
              detail: { elementId: args.elementId, message: args.message }
            }));
          }, 500);
        } else {
          // Already on the correct page, dispatch immediately
          window.dispatchEvent(new CustomEvent('highlight-ui-element', {
            detail: { elementId: args.elementId, message: args.message }
          }));
        }
      }
    }
  }, [messages, processedToolCalls]);

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
