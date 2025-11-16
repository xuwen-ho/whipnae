/**
 * Quiz Response Types
 * Defines the structure of user responses to the financial profiling quiz
 */

export type AgeGroup = 'early-career' | 'establishing' | 'mid-career' | 'pre-retirement' | 'retired';

export type FinancialSituation = 'starting-out' | 'some-savings' | 'comfortable' | 'significant-assets';

export type FinancialObjective =
  | 'emergency-fund'
  | 'major-purchase'
  | 'retirement'
  | 'passive-income'
  | 'pay-debt'
  | 'business'
  | 'financial-independence';

export type TimeHorizon = 'short' | 'medium' | 'long' | 'very-long';

export type InvestmentComfort = 'guaranteed' | 'moderate' | 'significant' | 'high-risk';

export type MarketDownturnResponse = 'sell' | 'anxious-hold' | 'calm-wait' | 'buy-more';

export type IncomeStability = 'very-stable' | 'moderately-stable' | 'variable' | 'unpredictable';

export type SavingsHabits = 'struggle' | 'occasional' | 'fixed-monthly' | 'automated';

export type FinancialKnowledge = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type InvestmentPreference =
  | 'esg-sustainable'
  | 'technology'
  | 'real-estate'
  | 'index-funds'
  | 'individual-stocks'
  | 'bonds'
  | 'alternative';

/**
 * Complete quiz response structure
 */
export interface QuizResponse {
  // Personal Information (required)
  userName: string;

  // Demographics & Life Stage (required)
  ageGroup: AgeGroup;
  financialSituation: FinancialSituation;

  // Financial Goals (required)
  primaryObjectives: FinancialObjective[]; // Max 3
  timeHorizon: TimeHorizon;

  // Risk Appetite (required)
  investmentComfort: InvestmentComfort;
  marketDownturn: MarketDownturnResponse;
  incomeStability: IncomeStability;

  // Financial Behaviors (required)
  savingsHabits: SavingsHabits;
  financialKnowledge: FinancialKnowledge;

  // Preferences (optional)
  investmentPreferences?: InvestmentPreference[];
}

/**
 * Partial quiz response for in-progress state
 */
export type PartialQuizResponse = Partial<QuizResponse>;

/**
 * Profile types generated from quiz responses
 */
export type ProfileType =
  | 'conservative-builder'
  | 'balanced-growth'
  | 'aggressive-growth'
  | 'pre-retirement-preserver';

export type RiskTolerance = 'low' | 'moderate' | 'high';

/**
 * Financial profile generated from quiz
 */
export interface FinancialProfile {
  userName: string;
  profileType: ProfileType;
  profileName: string;
  profileSummary: string;
  riskScore: number; // 1-10 scale
  recommendations: string[];
  characteristics: {
    riskTolerance: RiskTolerance;
    timeHorizon: string;
    savingsPattern: string;
    knowledgeLevel: string;
  };
}

/**
 * Quiz question types
 */
export type QuestionType = 'single-select' | 'multi-select' | 'text-input';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: keyof QuizResponse;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options: QuestionOption[];
  maxSelections?: number; // For multi-select questions
}

/**
 * Quiz step/section
 */
export interface QuizStep {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

/**
 * Quiz state management
 */
export interface QuizState {
  currentStep: number;
  responses: PartialQuizResponse;
  isComplete: boolean;
  profile?: FinancialProfile;
}
