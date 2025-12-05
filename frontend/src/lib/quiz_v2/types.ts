/**
 * Quiz types tailored to the new 9-question flow
 */

export type StageOfLife = 'just_starting' | 'building' | 'established' | 'retiring';
export type FinancialSituation =
  | 'struggling_debt'
  | 'some_savings'
  | 'stable_with_emergency'
  | 'high_income_assets';

export type MainGoal = 'emergency_fund' | 'big_purchase' | 'long_term_growth' | 'protect_income';
export type MonthlySavings = 'cant_save' | 'less_10' | 'around_10_20' | 'more_20';

export type InvestmentComfort = 'dislike_losses' | 'accept_small' | 'moderate_ok' | 'tolerate_big_swings';

// Q7: 1-5 scale stored as string in responses ("1".."5")
export type KnowledgeRating = '1' | '2' | '3' | '4' | '5';

export type PrimaryInterest =
  | 'cash_savings'
  | 'bonds'
  | 'index_funds'
  | 'individual_stocks'
  | 'real_estate'
  | 'alternatives';

export type TimeHorizon = 'short' | 'medium' | 'long' | 'very_long';

/**
 * Complete quiz response structure (partial allowed during progress)
 */
export interface QuizResponse {
  userName?: string; // Q1 free text

  // Q2
  stageOfLife?: StageOfLife;

  // Q3
  financialSituation?: FinancialSituation;

  // Q4
  mainGoal?: MainGoal;

  // Q5
  monthlySavings?: MonthlySavings;

  // Q6
  investmentComfort?: InvestmentComfort;

  // Q7
  financialKnowledge?: KnowledgeRating;

  // Q8
  primaryInterest?: PrimaryInterest;

  // Q9
  timeHorizon?: TimeHorizon;
}

export type PartialQuizResponse = Partial<QuizResponse>;

/**
 * Financial profile produced by scoring
 */
export interface FinancialProfile {
  userName?: string;
  riskScore: number; // 0-100
  riskCategory: 'Conservative' | 'Moderate' | 'Aggressive';
  expertiseLevel: 'Beginner' | 'Intermediate' | 'Expert';
  primaryInterest: string;
  timeHorizon: TimeHorizon | null;
  suggestions: string[];
}

/**
 * Question types used by the UI
 */
export type QuestionType = 'single-select' | 'multi-select' | 'text-input';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  maxSelections?: number;
}

export interface QuizStep {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}
