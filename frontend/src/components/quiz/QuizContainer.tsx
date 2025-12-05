"use client";

import { useState, useEffect } from 'react';
import type { PartialQuizResponse, FinancialProfile } from '@/lib/quiz_v2/types';
import { quizSteps } from '@/lib/quiz_v2/questions';
import { validateStep, isCompleteResponse } from '@/lib/quiz_v2/validation';
import { calculateFinancialProfile } from '@/lib/quiz_v2/scoring';
import { QuizProgress } from './QuizProgress';
import { QuizStep } from './QuizStep';
import { QuizResults } from './QuizResults';

const STORAGE_KEY = 'whipnae-quiz-progress';

type QuizContainerProps = {
  onComplete?: (profile: FinancialProfile) => void;
  onSave?: (profile: FinancialProfile) => void;
};

export function QuizContainer({ onComplete, onSave }: QuizContainerProps) {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [responses, setResponses] = useState<PartialQuizResponse>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const shouldRestart = sessionStorage.getItem('whipnae-quiz-restart');
      const saved = localStorage.getItem(STORAGE_KEY);

      // Load saved responses if they exist
      if (saved) {
        const parsed = JSON.parse(saved);
        setResponses(parsed.responses || {});

        // If restart flag is set, always start at step 1 (but keep responses)
        if (shouldRestart === 'true') {
          setCurrentStepId(1);
          sessionStorage.removeItem('whipnae-quiz-restart');
        } else {
          // Ensure currentStepId is valid (between 1 and total steps)
          const savedStepId = parsed.currentStepId || 1;
          const validStepId = Math.max(1, Math.min(savedStepId, quizSteps.length));
          setCurrentStepId(validStepId);
        }
      } else {
        // No saved data, start fresh at step 1
        setCurrentStepId(1);
        if (shouldRestart === 'true') {
          sessionStorage.removeItem('whipnae-quiz-restart');
        }
      }
    } catch (error) {
      console.error('Failed to load quiz progress:', error);
      // On error, reset to step 1
      setCurrentStepId(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever responses change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            responses,
            currentStepId,
          })
        );
      } catch (error) {
        console.error('Failed to save quiz progress:', error);
      }
    }
  }, [responses, currentStepId, isLoading]);

  const currentStep = quizSteps.find((s) => s.id === currentStepId) || quizSteps[0];
  const isLastStep = currentStep.id === quizSteps[quizSteps.length - 1].id;
  const isFirstStep = currentStep.id === quizSteps[0].id;

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error for this question
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    // Validate current step
    const validation = validateStep(currentStepId, responses);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    if (isLastStep) {
      // Calculate profile and show results
      if (isCompleteResponse(responses)) {
        const calculatedProfile = calculateFinancialProfile(responses);
        setProfile(calculatedProfile);
        if (onComplete) {
          onComplete(calculatedProfile);
        }
      }
    } else {
      // Move to next step (ensure we don't exceed total steps)
      const nextStepId = Math.min(currentStepId + 1, quizSteps.length);
      setCurrentStepId(nextStepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepId > 1) {
      const prevStepId = Math.max(currentStepId - 1, 1);
      setCurrentStepId(prevStepId);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setResponses({});
    setErrors({});
    setCurrentStepId(1);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (profile && onSave) {
      onSave(profile);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show results screen
  if (profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <QuizResults profile={profile} onRetake={handleRetake} onSave={handleSave} />
      </div>
    );
  }

  // Show quiz steps
  if (!currentStep) {
    return <div>Error: Invalid step</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-8">
        {/* Progress Bar */}
        <QuizProgress currentStep={currentStepId} totalSteps={quizSteps.length} />

        {/* Current Step */}
        <QuizStep
          step={currentStep}
          responses={responses}
          errors={errors}
          onResponseChange={handleResponseChange}
        />

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className="rounded-full border-2 border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLastStep ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
