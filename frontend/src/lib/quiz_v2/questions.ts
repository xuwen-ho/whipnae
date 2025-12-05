import type { QuizStep } from './types';

export const quizSteps: QuizStep[] = [
  {
    id: 1,
    title: 'About You',
    description: 'Tell us your name and life stage',
    questions: [
      {
        id: 'userName',
        type: 'text-input',
        title: 'What is your name?',
        description: 'Used to personalize your experience',
        required: true,
      },
      {
        id: 'stageOfLife',
        type: 'single-select',
        title: 'Which best describes your current stage of life?',
        required: true,
        options: [
          { value: 'just_starting', label: 'Just starting out (student or early career, usually under 30)' },
          { value: 'building', label: 'Building career and family (around 30–45)' },
          { value: 'established', label: 'Established and growing wealth (around 45–60)' },
          { value: 'retiring', label: 'Nearing or in retirement (around 60+)' },
        ],
      },
      {
        id: 'financialSituation',
        type: 'single-select',
        title: 'Which best describes your current financial situation?',
        required: true,
        options: [
          { value: 'struggling_debt', label: "I'm struggling with debt and have little or no savings" },
          { value: 'some_savings', label: 'I have some savings but also some debt; I get by' },
          { value: 'stable_with_emergency', label: 'I have stable income and an emergency fund (3–6 months of expenses)' },
          { value: 'high_income_assets', label: 'I have high or multiple income sources and significant assets' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Goals & Savings',
    description: 'Tell us your main goal and how much you save monthly',
    questions: [
      {
        id: 'mainGoal',
        type: 'single-select',
        title: 'What is your main savings or investment goal right now?',
        required: true,
        options: [
          { value: 'emergency_fund', label: 'Build or top up an emergency fund' },
          { value: 'big_purchase', label: 'Save for a big purchase (car, house, education) in the next few years' },
          { value: 'long_term_growth', label: 'Grow my wealth for the long term (retirement or financial freedom)' },
          { value: 'protect_income', label: 'Protect my existing wealth and generate income from it' },
        ],
      },
      {
        id: 'monthlySavings',
        type: 'single-select',
        title: 'Roughly how much do you save or invest each month (as a % of your income)?',
        required: true,
        options: [
          { value: 'cant_save', label: "I usually can't save" },
          { value: 'less_10', label: 'Less than 10% of my income' },
          { value: 'around_10_20', label: 'Around 10–20% of my income' },
          { value: 'more_20', label: 'More than 20% of my income' },
        ],
      },
      {
        id: 'investmentComfort',
        type: 'single-select',
        title: 'How comfortable are you with investment risk (ups and downs in value)?',
        required: true,
        options: [
          { value: 'dislike_losses', label: 'I really dislike seeing my investments go down; I want to avoid losses' },
          { value: 'accept_small', label: 'I can accept small ups and downs for modest growth' },
          { value: 'moderate_ok', label: "I'm okay with moderate ups and downs for higher long-term growth" },
          { value: 'tolerate_big_swings', label: 'I can tolerate big swings in value if it means higher potential returns' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Knowledge, Interest & Horizon',
    description: 'A few final questions about knowledge, interest and time horizon',
    questions: [
      {
        id: 'financialKnowledge',
        type: 'single-select',
        title: 'How would you rate your financial and investing knowledge?',
        required: true,
        options: [
          { value: '1', label: '1 — Very new – I\'m just starting to learn' },
          { value: '2', label: '2 — Basic – I know some concepts but not in depth' },
          { value: '3', label: '3 — Intermediate – I understand the basics of stocks, bonds, funds' },
          { value: '4', label: '4 — Advanced – I\'ve been investing for a while and do my own research' },
          { value: '5', label: '5 — Very experienced – I\'m very confident in my investment decisions' },
        ],
      },
      {
        id: 'primaryInterest',
        type: 'single-select',
        title: 'Which type of investment are you MOST interested in right now?',
        required: true,
        options: [
          { value: 'cash_savings', label: 'Cash and savings products (high-yield savings, deposits, CDs, money market)' },
          { value: 'bonds', label: 'Bonds or bond funds (government or corporate)' },
          { value: 'index_funds', label: 'Stock index funds or ETFs (broad market funds)' },
          { value: 'individual_stocks', label: 'Individual stocks or sector funds' },
          { value: 'real_estate', label: 'Real estate or REITs (real-estate investment trusts)' },
          { value: 'alternatives', label: 'Alternative assets (e.g., commodities, crypto, private equity, etc.)' },
        ],
      },
      {
        id: 'timeHorizon',
        type: 'single-select',
        title: 'What is your primary time horizon for your main goal?',
        required: true,
        options: [
          { value: 'short', label: 'Short term – less than 3 years' },
          { value: 'medium', label: 'Medium term – 3 to 7 years' },
          { value: 'long', label: 'Long term – 7 to 15 years' },
          { value: 'very_long', label: 'Very long term – more than 15 years' },
        ],
      },
    ],
  },
];
