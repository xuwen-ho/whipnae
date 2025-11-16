// lib/ai/tools.ts
import { z } from 'zod';
import {
  getSpendingByCategory,
  getAllCategorySpending,
  getAccountBalances,
  getRecentTransactions,
  getMonthlySpending,
  getRecurringTransactions,
  searchTransactions,
} from '@/lib/db/queries';

// Default user ID - in production, this should come from auth session
const DEFAULT_USER_ID = 1;

export const financialTools = {
  getSpendingByCategory: {
    description: 'Get total spending for a specific category over a time period. Use this when user asks about spending in a particular category like "food", "transport", "entertainment", etc.',
    parameters: z.object({
      categoryName: z.string().describe('The name of the spending category to query'),
      days: z.number().default(30).describe('Number of days to look back (default: 30)'),
    }),
    execute: async ({ categoryName, days }: { categoryName: string; days: number }) => {
      const result = getSpendingByCategory(DEFAULT_USER_ID, categoryName, days);
      return result;
    },
  },

  getAllCategorySpending: {
    description: 'Get spending breakdown across all categories for a time period. Use this when user asks for spending summary or wants to see all categories.',
    parameters: z.object({
      days: z.number().default(30).describe('Number of days to look back (default: 30)'),
    }),
    execute: async ({ days }: { days: number }) => {
      const results = getAllCategorySpending(DEFAULT_USER_ID, days);
      return { categories: results, period_days: days };
    },
  },

  getAccountBalances: {
    description: 'Get current balances for all user accounts. Use this when user asks about their balance, account status, or how much money they have.',
    parameters: z.object({}),
    execute: async () => {
      const balances = getAccountBalances(DEFAULT_USER_ID);
      const totalBalance = balances.reduce((sum, acc) => sum + acc.balance_cny, 0);
      return {
        accounts: balances,
        total_balance_cny: totalBalance,
      };
    },
  },

  getRecentTransactions: {
    description: 'Get recent transactions. Use this when user asks about recent purchases, latest transactions, or what they spent recently.',
    parameters: z.object({
      limit: z.number().default(10).describe('Number of transactions to return (default: 10)'),
    }),
    execute: async ({ limit }: { limit: number }) => {
      const transactions = getRecentTransactions(DEFAULT_USER_ID, limit);
      return { transactions, count: transactions.length };
    },
  },

  getMonthlySpending: {
    description: 'Get monthly spending and income summary. Use this when user asks about monthly trends, spending history, or income vs expenses.',
    parameters: z.object({
      months: z.number().default(6).describe('Number of months to return (default: 6)'),
    }),
    execute: async ({ months }: { months: number }) => {
      const monthlySummary = getMonthlySpending(DEFAULT_USER_ID, months);
      return { monthly_data: monthlySummary };
    },
  },

  getRecurringTransactions: {
    description: 'Get all active recurring transactions/subscriptions. Use this when user asks about subscriptions, recurring payments, or regular bills.',
    parameters: z.object({}),
    execute: async () => {
      const recurring = getRecurringTransactions(DEFAULT_USER_ID);
      const totalMonthly = recurring
        .filter(r => r.cadence === 'monthly')
        .reduce((sum, r) => sum + r.amount_cny, 0);
      return {
        recurring_transactions: recurring,
        total_monthly_recurring: totalMonthly,
      };
    },
  },

  searchTransactions: {
    description: 'Search transactions by keyword in description, merchant name, or raw text. Use this when user asks to find specific transactions or mentions a merchant name.',
    parameters: z.object({
      searchTerm: z.string().describe('The search term to find in transactions'),
      limit: z.number().default(10).describe('Maximum number of results (default: 10)'),
    }),
    execute: async ({ searchTerm, limit }: { searchTerm: string; limit: number }) => {
      const results = searchTransactions(DEFAULT_USER_ID, searchTerm, limit);
      return {
        transactions: results,
        count: results.length,
        search_term: searchTerm,
      };
    },
  },
} as const;
