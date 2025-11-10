import type { PartialQuizResponse, QuizResponse } from './types';
import { quizSteps } from './questions';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate a specific step's responses
 */
export function validateStep(stepId: number, responses: PartialQuizResponse): ValidationResult {
  const step = quizSteps.find((s) => s.id === stepId);
  if (!step) {
    return { isValid: false, errors: { step: 'Invalid step' } };
  }

  const errors: Record<string, string> = {};

  for (const question of step.questions) {
    if (!question.required) continue;

    const value = responses[question.id];

    // Check if required field is present
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors[question.id] = 'This field is required';
      continue;
    }

    // Validate multi-select max selections
    if (question.type === 'multi-select' && question.maxSelections && Array.isArray(value)) {
      if (value.length > question.maxSelections) {
        errors[question.id] = `Please select at most ${question.maxSelections} options`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate entire quiz responses
 */
export function validateQuiz(responses: PartialQuizResponse): ValidationResult {
  const allErrors: Record<string, string> = {};

  for (const step of quizSteps) {
    const stepValidation = validateStep(step.id, responses);
    Object.assign(allErrors, stepValidation.errors);
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
  };
}

/**
 * Check if quiz is complete (all required fields filled)
 */
export function isQuizComplete(responses: PartialQuizResponse): boolean {
  const validation = validateQuiz(responses);
  return validation.isValid;
}

/**
 * Type guard to check if partial response is complete
 */
export function isCompleteResponse(responses: PartialQuizResponse): responses is QuizResponse {
  return isQuizComplete(responses);
}

/**
 * Get progress percentage
 */
export function getQuizProgress(responses: PartialQuizResponse): number {
  let answeredCount = 0;
  let totalRequired = 0;

  for (const step of quizSteps) {
    for (const question of step.questions) {
      if (!question.required) continue;

      totalRequired++;
      const value = responses[question.id];

      if (value && (!Array.isArray(value) || value.length > 0)) {
        answeredCount++;
      }
    }
  }

  return totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;
}

/**
 * Check if a specific step can be navigated to (all previous steps valid)
 */
export function canNavigateToStep(stepId: number, responses: PartialQuizResponse): boolean {
  // Can always go to first step
  if (stepId === 1) return true;

  // Check all previous steps are valid
  for (let i = 1; i < stepId; i++) {
    const validation = validateStep(i, responses);
    if (!validation.isValid) return false;
  }

  return true;
}
