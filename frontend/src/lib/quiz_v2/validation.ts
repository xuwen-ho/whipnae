import type { PartialQuizResponse, QuizStep } from './types';
import { quizSteps } from './questions';

export function validateStep(stepId: number, responses: PartialQuizResponse) {
  const step = quizSteps.find((s) => s.id === stepId);
  if (!step) return { isValid: true, errors: {} };

  const errors: Record<string, string> = {};
  for (const q of step.questions) {
    if (q.required) {
      const val = (responses as any)[q.id];
      if (val === undefined || val === null || val === '') {
        errors[q.id] = 'This question is required';
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function isCompleteResponse(responses: PartialQuizResponse) {
  for (const step of quizSteps) {
    for (const q of step.questions) {
      if (q.required) {
        const val = (responses as any)[q.id];
        if (val === undefined || val === null || val === '') return false;
      }
    }
  }
  return true;
}
