/**
 * Bundle Recommendation Logic
 * Links quiz results to appropriate investment bundles
 */

import type { FinancialProfile, PrimaryInterest, TimeHorizon } from './types';
import { bundles } from '../bundles';

export interface BundleRecommendation {
  bundleId: string;
  title: string;
  riskLevel: string;
  description: string;
  imageUrl: string;
  matchScore: number; // 0-100 how well it matches the profile
  matchReasons: string[];
}

// Parse risk level string like "7/10" to number
function parseRiskLevel(riskStr: string): number {
  const match = riskStr.match(/(\d+)\/10/);
  return match ? parseInt(match[1], 10) : 5;
}

// Map risk category to acceptable risk range
function getRiskRange(riskCategory: FinancialProfile['riskCategory']): { min: number; max: number } {
  switch (riskCategory) {
    case 'Conservative':
      return { min: 1, max: 4 };
    case 'Moderate':
      return { min: 3, max: 7 };
    case 'Aggressive':
      return { min: 6, max: 10 };
    default:
      return { min: 1, max: 10 };
  }
}

// Map primary interest to bundle categories
function getInterestBundles(interest: PrimaryInterest): string[] {
  switch (interest) {
    case 'cash_savings':
      return ['gold-bundle']; // Gold is defensive/stable
    case 'bonds':
      return ['gold-bundle', 'travel-bundle']; // Lower risk, stable
    case 'index_funds':
      return ['digital-bundle', 'travel-bundle', 'media-bundle']; // Diversified exposure
    case 'individual_stocks':
      return ['tech-bundle', 'electric-autonomous-bundle', 'media-bundle']; // Individual company exposure
    case 'real_estate':
      return ['travel-bundle']; // Hospitality/real assets
    case 'alternatives':
      return ['crypto-bundle', 'gold-bundle']; // Alternative assets
    default:
      return [];
  }
}

// Map time horizon to suitable bundles
function getTimeHorizonBundles(horizon: TimeHorizon | null): { preferred: string[]; avoid: string[] } {
  switch (horizon) {
    case 'short':
      return {
        preferred: ['gold-bundle'], // Defensive
        avoid: ['crypto-bundle', 'electric-autonomous-bundle'], // Too volatile
      };
    case 'medium':
      return {
        preferred: ['travel-bundle', 'digital-bundle', 'media-bundle'],
        avoid: ['crypto-bundle'],
      };
    case 'long':
      return {
        preferred: ['tech-bundle', 'digital-bundle', 'media-bundle'],
        avoid: [],
      };
    case 'very_long':
      return {
        preferred: ['tech-bundle', 'electric-autonomous-bundle', 'crypto-bundle'],
        avoid: [],
      };
    default:
      return { preferred: [], avoid: [] };
  }
}

/**
 * Get bundle recommendations based on financial profile
 */
export function getBundleRecommendations(profile: FinancialProfile): BundleRecommendation[] {
  const riskRange = getRiskRange(profile.riskCategory);
  const interestBundles = getInterestBundles(profile.primaryInterest as PrimaryInterest);
  const horizonPrefs = getTimeHorizonBundles(profile.timeHorizon);

  const recommendations: BundleRecommendation[] = [];

  for (const bundle of bundles) {
    const bundleRisk = parseRiskLevel(bundle.riskLevel);
    let matchScore = 0;
    const matchReasons: string[] = [];

    // 1. Risk matching (40 points max)
    if (bundleRisk >= riskRange.min && bundleRisk <= riskRange.max) {
      matchScore += 40;
      matchReasons.push(`Matches your ${profile.riskCategory.toLowerCase()} risk profile`);
    } else if (bundleRisk === riskRange.min - 1 || bundleRisk === riskRange.max + 1) {
      // Close to range
      matchScore += 20;
      matchReasons.push(`Close to your risk tolerance`);
    }

    // 2. Interest matching (30 points max)
    if (interestBundles.includes(bundle.id)) {
      matchScore += 30;
      matchReasons.push(`Aligns with your interest in ${formatInterest(profile.primaryInterest)}`);
    }

    // 3. Time horizon matching (20 points max)
    if (horizonPrefs.preferred.includes(bundle.id)) {
      matchScore += 20;
      matchReasons.push(`Suitable for your ${formatTimeHorizon(profile.timeHorizon)} time horizon`);
    } else if (horizonPrefs.avoid.includes(bundle.id)) {
      matchScore -= 20;
      matchReasons.push(`May be too volatile for your time horizon`);
    }

    // 4. Expertise bonus (10 points max)
    if (profile.expertiseLevel === 'Beginner' && bundleRisk <= 5) {
      matchScore += 10;
      matchReasons.push('Good starting point for new investors');
    } else if (profile.expertiseLevel === 'Expert' && bundleRisk >= 7) {
      matchScore += 10;
      matchReasons.push('Matches your experience level');
    } else if (profile.expertiseLevel === 'Intermediate') {
      matchScore += 5;
    }

    // Only include bundles with positive scores
    if (matchScore > 0) {
      recommendations.push({
        bundleId: bundle.id,
        title: bundle.title,
        riskLevel: bundle.riskLevel,
        description: bundle.description,
        imageUrl: bundle.imageUrl,
        matchScore: Math.min(100, Math.max(0, matchScore)),
        matchReasons: matchReasons.filter(r => !r.includes('volatile')), // Filter out negative reasons for display
      });
    }
  }

  // Sort by match score (highest first)
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
}

/**
 * Get top N recommended bundles
 */
export function getTopBundleRecommendations(
  profile: FinancialProfile,
  count: number = 3
): BundleRecommendation[] {
  return getBundleRecommendations(profile).slice(0, count);
}

// Helper formatters
function formatInterest(interest: string): string {
  const map: Record<string, string> = {
    cash_savings: 'cash and savings',
    bonds: 'bonds',
    index_funds: 'index funds',
    individual_stocks: 'individual stocks',
    real_estate: 'real estate',
    alternatives: 'alternative investments',
  };
  return map[interest] || interest;
}

function formatTimeHorizon(horizon: TimeHorizon | null): string {
  const map: Record<string, string> = {
    short: 'short-term',
    medium: 'medium-term',
    long: 'long-term',
    very_long: 'very long-term',
  };
  return horizon ? map[horizon] || horizon : 'medium-term';
}
