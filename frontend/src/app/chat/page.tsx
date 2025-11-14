'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

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
      <main className="relative z-10 flex-1 bg-gray-100">
        <div className="mx-auto h-full max-w-3xl px-6 py-6">
          <div className="flex h-full flex-col">
            {/* Messages Container */}
            <div className="mb-6 flex-1 space-y-4 overflow-y-auto rounded-lg bg-white p-6 shadow-sm">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
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
                messages.map(message => (
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
                      {message.parts.map((part, index) =>
                        part.type === 'text' ? (
                          <p key={index} className="whitespace-pre-wrap text-sm">
                            {part.text}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
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
        </div>
      </main>

      <BottomNav />
    </div>
  );
}