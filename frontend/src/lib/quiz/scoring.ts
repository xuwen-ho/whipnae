import type { FinancialProfile, QuizResponse, ProfileType, RiskTolerance } from './types';

/**
 * Scoring weights for risk calculation
 */
const RISK_WEIGHTS = {
  investmentComfort: 0.3,
  marketDownturn: 0.25,
  timeHorizon: 0.2,
  incomeStability: 0.15,
  financialKnowledge: 0.1,
};

/**
 * Risk scores for each option (1-10 scale)
 */
const SCORES = {
  investmentComfort: {
    guaranteed: 2,
    moderate: 5,
    significant: 7,
    'high-risk': 9,
  },
  marketDownturn: {
    sell: 2,
    'anxious-hold': 4,
    'calm-wait': 7,
    'buy-more': 9,
  },
  timeHorizon: {
    short: 3,
    medium: 5,
    long: 7,
    'very-long': 9,
  },
  incomeStability: {
    'very-stable': 8,
    'moderately-stable': 6,
    variable: 4,
    unpredictable: 2,
  },
  financialKnowledge: {
    beginner: 3,
    intermediate: 5,
    advanced: 7,
    expert: 9,
  },
};

/**
 * Calculate overall risk score (1-10)
 */
function calculateRiskScore(responses: QuizResponse): number {
  const comfortScore = SCORES.investmentComfort[responses.investmentComfort] * RISK_WEIGHTS.investmentComfort;
  const downturnScore = SCORES.marketDownturn[responses.marketDownturn] * RISK_WEIGHTS.marketDownturn;
  const horizonScore = SCORES.timeHorizon[responses.timeHorizon] * RISK_WEIGHTS.timeHorizon;
  const stabilityScore = SCORES.incomeStability[responses.incomeStability] * RISK_WEIGHTS.incomeStability;
  const knowledgeScore = SCORES.financialKnowledge[responses.financialKnowledge] * RISK_WEIGHTS.financialKnowledge;

  const totalScore = comfortScore + downturnScore + horizonScore + stabilityScore + knowledgeScore;

  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
}

/**
 * Determine risk tolerance category
 */
function getRiskTolerance(riskScore: number): RiskTolerance {
  if (riskScore <= 4) return 'low';
  if (riskScore <= 7) return 'moderate';
  return 'high';
}

/**
 * Determine profile type based on responses
 */
function determineProfileType(responses: QuizResponse, riskScore: number): ProfileType {
  const riskTolerance = getRiskTolerance(riskScore);
  const isPreRetirement = responses.ageGroup === 'pre-retirement' || responses.ageGroup === 'retired';
  const isLongTermHorizon = responses.timeHorizon === 'long' || responses.timeHorizon === 'very-long';
  const isConservativeSaver = responses.savingsHabits === 'fixed-monthly' || responses.savingsHabits === 'automated';

  // Pre-retirement with conservative approach
  if (isPreRetirement && riskTolerance !== 'high') {
    return 'pre-retirement-preserver';
  }

  // High risk tolerance with long horizon
  if (riskTolerance === 'high' && isLongTermHorizon) {
    return 'aggressive-growth';
  }

  // Low risk tolerance or short horizon
  if (riskTolerance === 'low' || responses.timeHorizon === 'short') {
    return 'conservative-builder';
  }

  // Default to balanced approach
  return 'balanced-growth';
}

/**
 * Get profile metadata
 */
function getProfileMetadata(profileType: ProfileType): {
  name: string;
  summary: string;
  recommendations: string[];
} {
  const profiles = {
    'conservative-builder': {
      name: 'Conservative Builder',
      summary: 'Low risk tolerance with stable income, focused on building a strong financial foundation.',
      recommendations: [
        'High-yield savings accounts for emergency fund',
        'Conservative bond funds for stable returns',
        'Diversified ETFs with low volatility',
        'Regular savings automation',
      ],
    },
    'balanced-growth': {
      name: 'Balanced Growth Seeker',
      summary: 'Moderate risk tolerance with medium-term goals, seeking steady growth and consistent progress.',
      recommendations: [
        'Diversified index funds (60% stocks, 40% bonds)',
        'Mix of growth and dividend stocks',
        'Real estate investment trusts (REITs)',
        'Regular portfolio rebalancing',
      ],
    },
    'aggressive-growth': {
      name: 'Risk-Tolerant Investor',
      summary: 'High risk tolerance with long time horizon, comfortable with volatility for maximum growth potential.',
      recommendations: [
        'Growth-focused stock ETFs',
        'Individual high-growth stocks',
        'Sector-specific investments (tech, emerging markets)',
        'Alternative investments for diversification',
      ],
    },
    'pre-retirement-preserver': {
      name: 'Pre-Retirement Preserver',
      summary: 'Lower risk focus with shorter time horizon, prioritizing wealth preservation and income generation.',
      recommendations: [
        'Income-generating dividend stocks',
        'Bond ladder for stable returns',
        'Conservative allocation (30% stocks, 70% bonds)',
        'Focus on capital preservation',
      ],
    },
  };

  return profiles[profileType];
}

/**
 * Generate time horizon description
 */
function getTimeHorizonDescription(timeHorizon: QuizResponse['timeHorizon']): string {
  const descriptions = {
    short: 'Short-term (< 2 years)',
    medium: 'Medium-term (2-5 years)',
    long: 'Long-term (5-10 years)',
    'very-long': 'Very long-term (10+ years)',
  };
  return descriptions[timeHorizon];
}

/**
 * Generate savings pattern description
 */
function getSavingsPatternDescription(savingsHabits: QuizResponse['savingsHabits']): string {
  const descriptions = {
    struggle: 'Developing consistent habits',
    occasional: 'Opportunistic saver',
    'fixed-monthly': 'Disciplined monthly saver',
    automated: 'Automated investor',
  };
  return descriptions[savingsHabits];
}

/**
 * Generate knowledge level description
 */
function getKnowledgeLevelDescription(knowledge: QuizResponse['financialKnowledge']): string {
  const descriptions = {
    beginner: 'Learning the basics',
    intermediate: 'Solid foundation',
    advanced: 'Experienced investor',
    expert: 'Portfolio manager',
  };
  return descriptions[knowledge];
}

/**
 * Main function to calculate financial profile from quiz responses
 */
export function calculateFinancialProfile(responses: QuizResponse): FinancialProfile {
  const riskScore = calculateRiskScore(responses);
  const riskTolerance = getRiskTolerance(riskScore);
  const profileType = determineProfileType(responses, riskScore);
  const metadata = getProfileMetadata(profileType);

  return {
    userName: responses.userName,
    profileType,
    profileName: metadata.name,
    profileSummary: metadata.summary,
    riskScore,
    recommendations: metadata.recommendations,
    characteristics: {
      riskTolerance,
      timeHorizon: getTimeHorizonDescription(responses.timeHorizon),
      savingsPattern: getSavingsPatternDescription(responses.savingsHabits),
      knowledgeLevel: getKnowledgeLevelDescription(responses.financialKnowledge),
    },
  };
}

/**
 * Get a quick profile summary for display
 */
export function getProfileSummary(profile: FinancialProfile): string {
  return `${profile.profileName} - ${profile.characteristics.riskTolerance} risk tolerance, ${profile.characteristics.timeHorizon.toLowerCase()}, ${profile.characteristics.savingsPattern.toLowerCase()}`;
}
