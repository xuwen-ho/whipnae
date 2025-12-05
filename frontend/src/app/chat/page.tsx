
'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import ReactMarkdown from 'react-markdown';

// Collapsible Tool Call Component
function ToolCallDisplay({ part, index }: { part: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract tool name from type (e.g., "tool-getSpendingByCategory" -> "getSpendingByCategory")
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
          <pre className="max-h-64 overflow-auto text-blue-600 text-xs whitespace-pre-wrap">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${status === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>
              {status === 'ready' ? '● Online' : '● Processing...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 overflow-hidden bg-gray-100">
        {/* Messages Container - Scrollable */}
        <div className="mx-auto h-full max-w-3xl overflow-y-auto px-6 py-6 pb-32">
          <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
            {messages.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-700">
                    Welcome to your AI Financial Assistant
                  </p>
                  <p className="text-sm text-slate-500">
                    Ask me anything about your finances, budgeting, or financial planning.
                  </p>
                </div>
              </div>
            ) : (
              messages
                .filter(message => {
                  // Filter out empty user messages (used for continuation)
                  if (message.role === 'user') {
                    const hasContent = message.parts.some(
                      part => part.type === 'text' && part.text.trim() !== ''
                    );
                    return hasContent;
                  }
                  return true;
                })
                .map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold opacity-70">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return (
                          <div key={index} className="prose prose-sm max-w-none text-sm">
                            <ReactMarkdown
                              components={{
                                p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
                                em: ({ children }: any) => <em className="italic">{children}</em>,
                                ul: ({ children }: any) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                li: ({ children }: any) => <li className="mb-1">{children}</li>,
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

        {/* Input Form - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white pb-16">
          <div className="mx-auto max-w-3xl px-6 py-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={status !== 'ready'}
                placeholder="Ask about your finances..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
              <button
                type="submit"
                disabled={status !== 'ready' || !input.trim()}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
