import type { QuizResponse, FinancialProfile } from './types';

// Risk points mapping per question as provided
const RISK_POINTS_Q2: Record<string, number> = {
  just_starting: 8,
  building: 6,
  established: 4,
  retiring: 2,
};

const RISK_POINTS_Q3: Record<string, number> = {
  struggling_debt: 1,
  some_savings: 3,
  stable_with_emergency: 6,
  high_income_assets: 8,
};

const RISK_POINTS_Q4: Record<string, number> = {
  emergency_fund: 1,
  big_purchase: 4,
  long_term_growth: 8,
  protect_income: 2,
};

const RISK_POINTS_Q5: Record<string, number> = {
  cant_save: 1,
  less_10: 3,
  around_10_20: 6,
  more_20: 8,
};

const RISK_POINTS_Q6: Record<string, { points: number; expertise_bonus: number }> = {
  dislike_losses: { points: 1, expertise_bonus: 0 },
  accept_small: { points: 4, expertise_bonus: 1 },
  moderate_ok: { points: 7, expertise_bonus: 2 },
  tolerate_big_swings: { points: 10, expertise_bonus: 3 },
};

const RISK_POINTS_Q9: Record<string, number> = {
  short: 1,
  medium: 4,
  long: 7,
  very_long: 9,
};

// experience_bonus for Q8
const EXPERIENCE_BONUS_Q8: Record<string, number> = {
  cash_savings: 0,
  bonds: 1,
  index_funds: 1,
  individual_stocks: 2,
  real_estate: 2,
  alternatives: 3,
};

// Map primary interest text
const PRIMARY_INTEREST_TEXT: Record<string, string> = {
  cash_savings: 'Cash and savings products (high-yield savings, deposits, CDs, money market)',
  bonds: 'Bonds or bond funds (government or corporate)',
  index_funds: 'Stock index funds or ETFs (broad market funds)',
  individual_stocks: 'Individual stocks or sector funds',
  real_estate: 'Real estate or REITs (real-estate investment trusts)',
  alternatives: 'Alternative assets (e.g., commodities, crypto, private equity, etc.)',
};

export function calculateFinancialProfile(responses: QuizResponse): FinancialProfile {
  // Safely extract values
  const q2 = responses.stageOfLife || 'building';
  const q3 = responses.financialSituation || 'some_savings';
  const q4 = responses.mainGoal || 'long_term_growth';
  const q5 = responses.monthlySavings || 'less_10';
  const q6 = responses.investmentComfort || 'accept_small';
  const q7 = responses.financialKnowledge || '3';
  const q8 = responses.primaryInterest || 'index_funds';
  const q9 = responses.timeHorizon || 'medium';

  const risk_points_total =
    (RISK_POINTS_Q2[q2] || 0) +
    (RISK_POINTS_Q3[q3] || 0) +
    (RISK_POINTS_Q4[q4] || 0) +
    (RISK_POINTS_Q5[q5] || 0) +
    (RISK_POINTS_Q6[q6]?.points || 0) +
    (RISK_POINTS_Q9[q9] || 0);

  const max_risk_points_total = 51; // as specified
  const riskScore = Math.round((risk_points_total / max_risk_points_total) * 100);

  let riskCategory: FinancialProfile['riskCategory'] = 'Moderate';
  if (riskScore <= 33) riskCategory = 'Conservative';
  else if (riskScore <= 66) riskCategory = 'Moderate';
  else riskCategory = 'Aggressive';

  // Expertise calculation
  const knowledge = parseInt(q7, 10); // 1-5
  const expertise_risk_bonus = RISK_POINTS_Q6[q6]?.expertise_bonus || 0;
  const experience_bonus = EXPERIENCE_BONUS_Q8[q8] || 0;

  const expertise_raw = (knowledge * 2) + expertise_risk_bonus + experience_bonus; // 2..16
  let expertiseLevel: FinancialProfile['expertiseLevel'] = 'Intermediate';
  if (expertise_raw <= 7) expertiseLevel = 'Beginner';
  else if (expertise_raw <= 12) expertiseLevel = 'Intermediate';
  else expertiseLevel = 'Expert';

  const primaryInterest = PRIMARY_INTEREST_TEXT[q8] || '';

  // Suggestions: build suggestion_core based on time horizon + risk category
  let suggestion_core: string[] = [];
  if (q9 === 'short') {
    suggestion_core = [
      'Focus on safety and liquidity.',
      'Consider high-yield savings accounts, money market funds, or short-term deposits.',
      'If you accept a bit more risk: add a small portion of short-term bond funds.',
    ];
  } else if (q9 === 'medium') {
    if (riskCategory === 'Conservative') {
      suggestion_core = [
        'Consider a bond-heavy portfolio (e.g., 70–80% bonds / 20–30% stock index funds).',
        'Use diversified bond funds and broad equity index funds.',
      ];
    } else if (riskCategory === 'Moderate') {
      suggestion_core = [
        'Consider a balanced portfolio (e.g., around 40–60% stocks / 40–60% bonds).',
        'Use broad stock index ETFs plus high-quality bond funds.',
      ];
    } else {
      suggestion_core = [
        'Consider a growth-oriented mix (e.g., 70–80% global stocks / 20–30% bonds).',
        'Use diversified equity ETFs, plus some bond funds for stability.',
      ];
    }
  } else if (q9 === 'long') {
    if (riskCategory === 'Conservative') {
      suggestion_core = [
        'Consider a cautious growth mix (e.g., 40% stocks / 60% bonds and cash).',
        'Use broad stock index funds plus high-quality bond funds.',
      ];
    } else if (riskCategory === 'Moderate') {
      suggestion_core = [
        'Consider a growth mix (e.g., 60–70% stocks / 30–40% bonds).',
        'Use global equity index funds as core holdings.',
      ];
    } else {
      suggestion_core = [
        'Consider a higher-equity portfolio (e.g., 80–90% stocks / 10–20% bonds).',
        'Use diversified equity ETFs/ index funds across regions and sectors.',
      ];
    }
  } else {
    // very_long
    if (riskCategory === 'Conservative') {
      suggestion_core = [
        'Consider a moderate mix (e.g., 50–60% stocks / 40–50% bonds).',
        'Focus on long-term diversified stock index funds plus bonds.',
      ];
    } else if (riskCategory === 'Moderate') {
      suggestion_core = [
        'Consider a growth-oriented mix (e.g., 70–80% stocks / 20–30% bonds).',
        'Use global stock index funds as the core of your portfolio.',
      ];
    } else {
      suggestion_core = [
        'Consider a mostly-equity portfolio (e.g., 90–100% stocks, optionally a small bond or cash buffer).',
        'Focus on diversified equity ETFs/index funds; optionally add small satellite positions in other assets.',
      ];
    }
  }

  // Expertise layer
  let suggestion_expertise_layer: string[] = [];
  if (expertiseLevel === 'Beginner') {
    suggestion_expertise_layer = [
      'Keep things simple using low-cost, diversified index funds or ETFs.',
      'Consider target-date or balanced funds if available.',
      'Focus on learning the basics before using complex or highly volatile investments.',
    ];
  } else if (expertiseLevel === 'Intermediate') {
    suggestion_expertise_layer = [
      'Use index funds as a core and optionally add a smaller portion in areas you want to research more deeply.',
      'Review your allocation annually and rebalance when it drifts from your target mix.',
    ];
  } else {
    suggestion_expertise_layer = [
      'You may combine a core allocation in broad index funds with satellite positions in sectors, factors, or specific themes.',
      'Ensure that position sizing and overall risk stay aligned with your long-term plan.',
    ];
  }

  // Interest layer
  let interest_layer = '';
  switch (q8) {
    case 'cash_savings':
      interest_layer = 'Since you prefer cash-like products, prioritize high-yield savings or money market funds and only add risk gradually if you feel comfortable.';
      break;
    case 'index_funds':
      interest_layer = 'Your interest in index funds fits well with a diversified, low-cost core portfolio across global stock and bond markets.';
      break;
    case 'individual_stocks':
      interest_layer = 'If you like individual stocks, consider limiting them to a smaller portion of your portfolio (e.g., 10–20%) with the rest in diversified index funds.';
      break;
    case 'real_estate':
      interest_layer = 'For real estate interest, you can explore REITs or real-estate funds as part of a diversified portfolio.';
      break;
    case 'alternatives':
      interest_layer = 'Alternative assets can be volatile; keep them as a smaller allocation and make sure your core remains diversified across traditional assets.';
      break;
    case 'bonds':
      interest_layer = 'Bonds fit well into conservative and income-focused allocations; consider laddering and high-quality bond funds.';
      break;
    default:
      interest_layer = '';
  }

  // Compose final suggestions (limit to 3-6 bullets): pick 2 from core, 1-2 from expertise layer, and interest_layer if present
  const finalSuggestions: string[] = [];
  // add up to 2 core
  finalSuggestions.push(...suggestion_core.slice(0, 2));
  // add 1-2 expertise
  finalSuggestions.push(...suggestion_expertise_layer.slice(0, 2));
  if (interest_layer) finalSuggestions.push(interest_layer);

  // trim to max 6
  while (finalSuggestions.length > 6) finalSuggestions.pop();

  const profile: FinancialProfile = {
    userName: responses.userName,
    riskScore,
    riskCategory,
    expertiseLevel,
    primaryInterest,
    timeHorizon: (responses.timeHorizon as any) || null,
    suggestions: finalSuggestions,
  };

  return profile;
}
