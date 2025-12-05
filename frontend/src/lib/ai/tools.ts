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

console.log('📦 [TOOLS] Financial tools module loaded');

// UI interaction tools (executed on frontend only)
export const uiTools = {
  highlightUIElement: {
    description: 'Highlight a UI element to help the user locate it. Use this when the user asks how to do something in the app, like starting a remote connection. The element will flash/pulse to draw attention.',
    inputSchema: z.object({
      elementId: z.enum(['remote-connection']).describe('The ID of the UI element to highlight'),
      message: z.string().optional().describe('Optional message to explain what the element does'),
    }),
    // Note: This tool is executed on the frontend via onToolCall, not here
    execute: async ({ elementId, message }: { elementId: string; message?: string }) => {
      console.log('🎯 [TOOL CALLED] highlightUIElement', { elementId, message });
      return { success: true, elementId, message: message || `Highlighting ${elementId}` };
    },
  },
};

export const financialTools = {
  getSpendingByCategory: {
    description: 'Get total spending for a specific category over a time period. Use this when user asks about spending in a particular category like "food", "transport", "entertainment", etc.',
    inputSchema: z.object({
      categoryName: z.string().describe('The name of the spending category to query'),
      days: z.number().default(30).describe('Number of days to look back (default: 30)'),
    }),
    execute: async ({ categoryName, days }: { categoryName: string; days: number }) => {
      console.log('🔧 [TOOL CALLED] getSpendingByCategory', { categoryName, days, userId: DEFAULT_USER_ID });
      const result = await getSpendingByCategory(DEFAULT_USER_ID, categoryName, days);
      console.log('✅ [TOOL RESULT] getSpendingByCategory:', result);
      return result;
    },
  },

  getAllCategorySpending: {
    description: 'Get spending breakdown across all categories for a time period. Use this when user asks for spending summary or wants to see all categories.',
    inputSchema: z.object({
      days: z.number().default(30).describe('Number of days to look back (default: 30)'),
    }),
    execute: async ({ days }: { days: number }) => {
      console.log('🔧 [TOOL CALLED] getAllCategorySpending', { days, userId: DEFAULT_USER_ID });
      const results = await getAllCategorySpending(DEFAULT_USER_ID, days);
      const response = { categories: results, period_days: days };
      console.log('✅ [TOOL RESULT] getAllCategorySpending:', response);
      return response;
    },
  },

  getAccountBalances: {
    description: 'Get current balances for all user accounts. Use this when user asks about their balance, account status, or how much money they have.',
    inputSchema: z.object({}),
    execute: async () => {
      console.log('🔧 [TOOL CALLED] getAccountBalances', { userId: DEFAULT_USER_ID });
      const balances = await getAccountBalances(DEFAULT_USER_ID);
      const totalBalance = balances.reduce((sum, acc) => sum + acc.balance_cny, 0);
      const response = {
        accounts: balances,
        total_balance_cny: totalBalance,
      };
      console.log('✅ [TOOL RESULT] getAccountBalances:', response);
      return response;
    },
  },

  getRecentTransactions: {
    description: 'Get recent transactions. Use this when user asks about recent purchases, latest transactions, or what they spent recently.',
    inputSchema: z.object({
      limit: z.number().default(10).describe('Number of transactions to return (default: 10)'),
    }),
    execute: async ({ limit }: { limit: number }) => {
      console.log('🔧 [TOOL CALLED] getRecentTransactions', { limit, userId: DEFAULT_USER_ID });
      const transactions = await getRecentTransactions(DEFAULT_USER_ID, limit);
      const response = { transactions, count: transactions.length };
      console.log('✅ [TOOL RESULT] getRecentTransactions:', response);
      return response;
    },
  },

  getMonthlySpending: {
    description: 'Get monthly spending and income summary. Use this when user asks about monthly trends, spending history, or income vs expenses.',
    inputSchema: z.object({
      months: z.number().default(6).describe('Number of months to return (default: 6)'),
    }),
    execute: async ({ months }: { months: number }) => {
      console.log('🔧 [TOOL CALLED] getMonthlySpending', { months, userId: DEFAULT_USER_ID });
      const monthlySummary = await getMonthlySpending(DEFAULT_USER_ID, months);
      const response = { monthly_data: monthlySummary };
      console.log('✅ [TOOL RESULT] getMonthlySpending:', response);
      return response;
    },
  },

  getRecurringTransactions: {
    description: 'Get all active recurring transactions/subscriptions. Use this when user asks about subscriptions, recurring payments, or regular bills.',
    inputSchema: z.object({}),
    execute: async () => {
      console.log('🔧 [TOOL CALLED] getRecurringTransactions', { userId: DEFAULT_USER_ID });
      const recurring = await getRecurringTransactions(DEFAULT_USER_ID);
      const totalMonthly = recurring
        .filter(r => r.cadence === 'monthly')
        .reduce((sum, r) => sum + r.amount_cny, 0);
      const response = {
        recurring_transactions: recurring,
        total_monthly_recurring: totalMonthly,
      };
      console.log('✅ [TOOL RESULT] getRecurringTransactions:', response);
      return response;
    },
  },

  searchTransactions: {
    description: 'Search transactions by keyword in description, merchant name, or raw text. Use this when user asks to find specific transactions or mentions a merchant name.',
    inputSchema: z.object({
      searchTerm: z.string().describe('The search term to find in transactions'),
      limit: z.number().default(10).describe('Maximum number of results (default: 10)'),
    }),
    execute: async ({ searchTerm, limit }: { searchTerm: string; limit: number }) => {
      console.log('🔧 [TOOL CALLED] searchTransactions', { searchTerm, limit, userId: DEFAULT_USER_ID });
      const results = await searchTransactions(DEFAULT_USER_ID, searchTerm, limit);
      const response = {
        transactions: results,
        count: results.length,
        search_term: searchTerm,
      };
      console.log('✅ [TOOL RESULT] searchTransactions:', response);
      return response;
    },
  },
};

console.log('✓ [TOOLS] Registered tools:', Object.keys(financialTools));
