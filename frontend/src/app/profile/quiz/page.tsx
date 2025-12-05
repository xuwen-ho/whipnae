"use client";

import { useRouter } from 'next/navigation';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import type { FinancialProfile } from '@/lib/quiz_v2/types';

export default function QuizPage() {
  const router = useRouter();

  const handleComplete = (profile: FinancialProfile) => {
    console.log('Quiz completed with profile:', profile);
    
    // Auto-save profile when quiz is completed
    try {
      localStorage.setItem('whipnae-user-profile', JSON.stringify(profile));
      console.log('Profile auto-saved on completion');
    } catch (error) {
      console.error('Failed to auto-save profile:', error);
    }
  };

  const handleSave = (profile: FinancialProfile) => {
    console.log('Saving profile:', profile);

    // Save to localStorage for now (later we'll send to backend)
    try {
      localStorage.setItem('whipnae-user-profile', JSON.stringify(profile));

      // Navigate back to profile page
      router.push('/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#1c3d8f] py-6 text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Financial Profile Quiz</h1>
              <p className="mt-1 text-sm text-blue-100">
                Help us understand your financial goals and preferences
              </p>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Return to profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="pb-12">
        <QuizContainer onComplete={handleComplete} onSave={handleSave} />
      </main>
    </div>
  );
}
