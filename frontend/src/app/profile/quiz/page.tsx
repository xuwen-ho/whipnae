"use client";

import { useRouter } from 'next/navigation';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import type { FinancialProfile } from '@/lib/quiz/types';

export default function QuizPage() {
  const router = useRouter();

  const handleComplete = (profile: FinancialProfile) => {
    console.log('Quiz completed with profile:', profile);
    // Profile is shown in the QuizContainer's results screen
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
          <h1 className="text-2xl font-bold">Financial Profile Quiz</h1>
          <p className="mt-1 text-sm text-blue-100">
            Help us understand your financial goals and preferences
          </p>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="pb-12">
        <QuizContainer onComplete={handleComplete} onSave={handleSave} />
      </main>
    </div>
  );
}
