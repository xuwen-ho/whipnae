'use client';

import { useState } from 'react';
import { useChatWidget } from './ChatWidgetProvider';
import { FiX, FiMinus, FiRefreshCw } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

// Collapsible Tool Call Component
function ToolCallDisplay({ part, index }: { part: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toolName = part.type.replace('tool-', '');
  
  return (
    <div className="mb-2 overflow-hidden rounded border border-blue-300 bg-blue-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-2 text-left hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-700">🔧</span>
          <span className="font-semibold text-blue-700 text-xs">
            Tool: {toolName}
          </span>
        </div>
        <span className="text-blue-500 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
      {isExpanded && (
        <div className="border-t border-blue-200 p-2">
          <pre className="max-h-40 overflow-auto text-blue-600 text-xs whitespace-pre-wrap">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ChatWidgetPanel() {
  const {
    close,
    minimize,
    newChat,
    messages,
    status,
    input,
    setInput,
    sendMessage,
    pageName,
  } = useChatWidget();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  // Filter out empty continuation messages
  const filteredMessages = messages.filter(message => {
    if (message.role === 'user') {
      const hasContent = message.parts.some(
        (part: any) => part.type === 'text' && part.text.trim() !== ''
      );
      return hasContent;
    }
    return true;
  });

  return (
    <div className="fixed bottom-24 right-4 z-50 flex w-[90%] max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:right-6"
      style={{ height: '55vh', minHeight: '400px', maxHeight: '600px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-900">AI Assistant</h2>
          <span className={`text-xs ${status === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>
            {status === 'ready' ? '● Online' : '● Processing...'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* New Chat button */}
          <button
            onClick={newChat}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            aria-label="New chat"
            title="New chat"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          {/* Minimize button */}
          <button
            onClick={minimize}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            aria-label="Minimize chat"
            title="Minimize"
          >
            <FiMinus className="h-4 w-4" />
          </button>
          {/* Close button */}
          <button
            onClick={close}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            aria-label="Close chat"
            title="Close"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Page context indicator */}
      <div className="border-b border-slate-100 bg-blue-50 px-4 py-2">
        <p className="text-xs text-blue-700">
          📍 Viewing: <span className="font-medium">{pageName}</span>
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="flex h-full min-h-[200px] items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Welcome to your AI Financial Assistant
                </p>
                <p className="text-xs text-slate-500">
                  Ask me anything about your finances.
                </p>
              </div>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold opacity-70">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  {message.parts.map((part: any, index: number) => {
                    if (part.type === 'text') {
                      return (
                        <div key={index} className="prose prose-sm max-w-none text-xs">
                          <ReactMarkdown
                            components={{
                              p: ({ children }: any) => <p className="mb-1.5 last:mb-0">{children}</p>,
                              strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
                              em: ({ children }: any) => <em className="italic">{children}</em>,
                              ul: ({ children }: any) => <ul className="list-disc list-inside mb-1.5">{children}</ul>,
                              ol: ({ children }: any) => <ol className="list-decimal list-inside mb-1.5">{children}</ol>,
                              li: ({ children }: any) => <li className="mb-0.5">{children}</li>,
                              code: ({ children }: any) => (
                                <code className="bg-slate-700 bg-opacity-20 px-1 py-0.5 rounded text-xs">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    } else if (part.type.startsWith('tool-')) {
                      return <ToolCallDisplay key={index} part={part} index={index} />;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={status !== 'ready'}
            placeholder="Ask about your finances..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
