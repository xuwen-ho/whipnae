import type { QuizStep } from './types';

/**
 * Complete quiz structure with all questions organized by steps
 */
export const quizSteps: QuizStep[] = [
  // Step 1: Demographics & Life Stage
  {
    id: 1,
    title: 'About You',
    description: 'Help us understand your current life stage and financial situation',
    questions: [
      {
        id: 'ageGroup',
        type: 'single-select',
        title: 'What stage of life are you in?',
        description: 'This helps us tailor recommendations to your timeline',
        required: true,
        options: [
          {
            value: 'early-career',
            label: 'Early Career',
            description: '18-25 years old',
          },
          {
            value: 'establishing',
            label: 'Establishing Career',
            description: '26-35 years old',
          },
          {
            value: 'mid-career',
            label: 'Mid-Career',
            description: '36-50 years old',
          },
          {
            value: 'pre-retirement',
            label: 'Pre-Retirement',
            description: '51-65 years old',
          },
          {
            value: 'retired',
            label: 'Retired',
            description: '65+ years old',
          },
        ],
      },
      {
        id: 'financialSituation',
        type: 'single-select',
        title: 'Which best describes your current financial situation?',
        required: true,
        options: [
          {
            value: 'starting-out',
            label: 'Just Starting Out',
            description: 'Building emergency fund',
          },
          {
            value: 'some-savings',
            label: 'Have Some Savings',
            description: 'Want to grow my money',
          },
          {
            value: 'comfortable',
            label: 'Comfortable Savings',
            description: 'Ready to invest',
          },
          {
            value: 'significant-assets',
            label: 'Significant Assets',
            description: 'Optimizing returns',
          },
        ],
      },
    ],
  },

  // Step 2: Financial Goals
  {
    id: 2,
    title: 'Your Goals',
    description: 'What are you working towards financially?',
    questions: [
      {
        id: 'primaryObjectives',
        type: 'multi-select',
        title: 'What are your primary financial objectives?',
        description: 'Select up to 3 that matter most to you',
        required: true,
        maxSelections: 3,
        options: [
          {
            value: 'emergency-fund',
            label: 'Build Emergency Fund',
            description: '3-6 months of expenses',
          },
          {
            value: 'major-purchase',
            label: 'Save for Major Purchase',
            description: 'Home, car, or education',
          },
          {
            value: 'retirement',
            label: 'Grow Wealth for Retirement',
            description: 'Long-term wealth building',
          },
          {
            value: 'passive-income',
            label: 'Generate Passive Income',
            description: 'Income from investments',
          },
          {
            value: 'pay-debt',
            label: 'Pay Off Debt',
            description: 'Reduce financial obligations',
          },
          {
            value: 'business',
            label: 'Start/Grow a Business',
            description: 'Entrepreneurial goals',
          },
          {
            value: 'financial-independence',
            label: 'Financial Independence',
            description: 'Early retirement / FIRE',
          },
        ],
      },
      {
        id: 'timeHorizon',
        type: 'single-select',
        title: 'What is your primary time horizon for these goals?',
        required: true,
        options: [
          {
            value: 'short',
            label: 'Short-term',
            description: 'Less than 2 years',
          },
          {
            value: 'medium',
            label: 'Medium-term',
            description: '2-5 years',
          },
          {
            value: 'long',
            label: 'Long-term',
            description: '5-10 years',
          },
          {
            value: 'very-long',
            label: 'Very Long-term',
            description: '10+ years',
          },
        ],
      },
    ],
  },

  // Step 3: Risk Appetite
  {
    id: 3,
    title: 'Risk & Comfort',
    description: 'Understanding your comfort with investment risk',
    questions: [
      {
        id: 'investmentComfort',
        type: 'single-select',
        title: 'What is your investment comfort level?',
        required: true,
        options: [
          {
            value: 'guaranteed',
            label: 'Guaranteed Returns',
            description: 'I prefer guaranteed returns, even if lower',
          },
          {
            value: 'moderate',
            label: 'Moderate Fluctuations',
            description: "I'm okay with small fluctuations for moderate growth",
          },
          {
            value: 'significant',
            label: 'Significant Ups & Downs',
            description: 'I can handle significant ups and downs for higher potential returns',
          },
          {
            value: 'high-risk',
            label: 'High Risk Tolerance',
            description: "I'm comfortable with high risk for maximum growth potential",
          },
        ],
      },
      {
        id: 'marketDownturn',
        type: 'single-select',
        title: 'If your investments dropped 20%, you would:',
        required: true,
        options: [
          {
            value: 'sell',
            label: 'Sell Immediately',
            description: 'Prevent further loss',
          },
          {
            value: 'anxious-hold',
            label: 'Feel Anxious but Hold',
            description: 'Stay invested but worry',
          },
          {
            value: 'calm-wait',
            label: 'Stay Calm and Wait',
            description: 'Confident in recovery',
          },
          {
            value: 'buy-more',
            label: 'Buy More',
            description: 'See it as an opportunity',
          },
        ],
      },
      {
        id: 'incomeStability',
        type: 'single-select',
        title: 'How stable is your income?',
        required: true,
        options: [
          {
            value: 'very-stable',
            label: 'Very Stable',
            description: 'Government or large corporation',
          },
          {
            value: 'moderately-stable',
            label: 'Moderately Stable',
            description: 'Established company',
          },
          {
            value: 'variable',
            label: 'Variable',
            description: 'Commission-based or freelance',
          },
          {
            value: 'unpredictable',
            label: 'Unpredictable',
            description: 'Startup or entrepreneur',
          },
        ],
      },
    ],
  },

  // Step 4: Financial Behaviors
  {
    id: 4,
    title: 'Your Habits',
    description: 'Tell us about your financial behaviors and knowledge',
    questions: [
      {
        id: 'savingsHabits',
        type: 'single-select',
        title: 'Which best describes your savings habits?',
        required: true,
        options: [
          {
            value: 'struggle',
            label: 'Struggle to Save',
            description: 'I struggle to save consistently',
          },
          {
            value: 'occasional',
            label: 'Save Occasionally',
            description: 'I save occasionally when possible',
          },
          {
            value: 'fixed-monthly',
            label: 'Fixed Monthly Savings',
            description: 'I save a fixed amount monthly',
          },
          {
            value: 'automated',
            label: 'Automated Savings',
            description: 'I automate savings and investments',
          },
        ],
      },
      {
        id: 'financialKnowledge',
        type: 'single-select',
        title: 'How would you rate your financial knowledge?',
        required: true,
        options: [
          {
            value: 'beginner',
            label: 'Beginner',
            description: 'Need guidance on basics',
          },
          {
            value: 'intermediate',
            label: 'Intermediate',
            description: 'Understand basic investing',
          },
          {
            value: 'advanced',
            label: 'Advanced',
            description: 'Comfortable with complex strategies',
          },
          {
            value: 'expert',
            label: 'Expert',
            description: 'Actively manage portfolio',
          },
        ],
      },
    ],
  },

  // Step 5: Preferences & Values
  {
    id: 5,
    title: 'Your Preferences',
    description: 'Help us personalize your experience (optional)',
    questions: [
      {
        id: 'investmentPreferences',
        type: 'multi-select',
        title: 'What types of investments interest you?',
        description: 'Select all that apply (optional)',
        required: false,
        options: [
          {
            value: 'esg-sustainable',
            label: 'ESG/Sustainable Investing',
            description: 'Environmentally and socially responsible',
          },
          {
            value: 'technology',
            label: 'Technology Sector',
            description: 'Tech companies and innovation',
          },
          {
            value: 'real-estate',
            label: 'Real Estate',
            description: 'Property and REITs',
          },
          {
            value: 'index-funds',
            label: 'Index Funds',
            description: 'Diversified portfolios',
          },
          {
            value: 'individual-stocks',
            label: 'Individual Stocks',
            description: 'Pick specific companies',
          },
          {
            value: 'bonds',
            label: 'Bonds/Fixed Income',
            description: 'Stable, predictable returns',
          },
          {
            value: 'alternative',
            label: 'Alternative Investments',
            description: 'Crypto, commodities, etc.',
          },
        ],
      },
    ],
  },
];

/**
 * Get a specific question by ID
 */
export function getQuestionById(questionId: string) {
  for (const step of quizSteps) {
    const question = step.questions.find((q) => q.id === questionId);
    if (question) return question;
  }
  return null;
}

/**
 * Get total number of required questions
 */
export function getTotalRequiredQuestions(): number {
  return quizSteps.reduce((total, step) => {
    return total + step.questions.filter((q) => q.required).length;
  }, 0);
}
