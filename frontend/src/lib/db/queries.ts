import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/db/transactions.db');

export interface SpendingInsight {
  totalSpent: number;
  totalIncome: number;
  netBalance: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  topMerchants: Array<{ merchant: string; amount: number; count: number }>;
  recurringExpenses: number;
  monthlyAverage: number;
}

export function getSpendingInsights(userId: number = 1): SpendingInsight {
  const db = new Database(DB_PATH, { readonly: true });

  try {
    // Get total spent and income
    const totals = db.prepare(`
      SELECT
        SUM(CASE WHEN type='debit' THEN amount_cents ELSE 0 END) / 100.0 AS total_spent,
        SUM(CASE WHEN type='credit' THEN amount_cents ELSE 0 END) / 100.0 AS total_income
      FROM transactions
      WHERE user_id = ? AND status = 'posted'
    `).get(userId) as { total_spent: number; total_income: number };

    // Get top spending categories
    const topCategories = db.prepare(`
      SELECT
        c.name AS category,
        SUM(t.amount_cents) / 100.0 AS amount,
        (SUM(t.amount_cents) * 100.0 / ?) AS percentage
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'debit' AND t.status = 'posted'
      GROUP BY c.name
      ORDER BY amount DESC
      LIMIT 5
    `).all(totals.total_spent * 100, userId) as Array<{ category: string; amount: number; percentage: number }>;

    // Get top merchants
    const topMerchants = db.prepare(`
      SELECT
        m.name AS merchant,
        SUM(t.amount_cents) / 100.0 AS amount,
        COUNT(*) AS count
      FROM transactions t
      JOIN merchants m ON t.merchant_id = m.id
      WHERE t.user_id = ? AND t.type = 'debit' AND t.status = 'posted'
      GROUP BY m.name
      ORDER BY amount DESC
      LIMIT 5
    `).all(userId) as Array<{ merchant: string; amount: number; count: number }>;

    // Get recurring expenses total
    const recurringTotal = db.prepare(`
      SELECT SUM(amount_cents) / 100.0 AS recurring_expenses
      FROM transactions
      WHERE user_id = ? AND type = 'debit' AND is_recurring = 1 AND status = 'posted'
    `).get(userId) as { recurring_expenses: number };

    // Calculate monthly average spending
    const monthlyData = db.prepare(`
      SELECT
        strftime('%Y-%m', posted_at) AS month,
        SUM(CASE WHEN type='debit' THEN amount_cents ELSE 0 END) / 100.0 AS spent
      FROM transactions
      WHERE user_id = ? AND status = 'posted'
      GROUP BY month
    `).all(userId) as Array<{ month: string; spent: number }>;

    const monthlyAverage = monthlyData.length > 0
      ? monthlyData.reduce((sum, m) => sum + m.spent, 0) / monthlyData.length
      : 0;

    return {
      totalSpent: totals.total_spent || 0,
      totalIncome: totals.total_income || 0,
      netBalance: (totals.total_income || 0) - (totals.total_spent || 0),
      topCategories,
      topMerchants,
      recurringExpenses: recurringTotal.recurring_expenses || 0,
      monthlyAverage,
    };
  } finally {
    db.close();
  }
}

export function getUserInfo(userId: number = 1) {
  const db = new Database(DB_PATH, { readonly: true });

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as {
      id: number;
      name: string;
      email: string;
      created_at: string;
    };

    const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(userId) as Array<{
      id: number;
      name: string;
      type: string;
      currency: string;
      institution: string;
    }>;

    return { user, accounts };
  } finally {
    db.close();
  }
// lib/db/queries.ts
import { getDB } from './index';

export interface SpendingResult {
  category: string;
  total_cny: number;
  period_days: number;
}

export interface AccountBalance {
  id: number;
  name: string;
  type: string;
  account_number_mask: string | null;
  balance_cents: number;
  balance_cny: number;
}

export interface Transaction {
  id: number;
  amount_cny: number;
  description: string;
  merchant_name: string | null;
  category_name: string | null;
  posted_at: string;
  type: string;
}

export interface MonthlySpending {
  year_month: string;
  spend_cny: number;
  income_cny: number;
  net_cny: number;
}

export interface RecurringTransaction {
  id: number;
  recurring_name: string;
  amount_cny: number;
  merchant_name: string | null;
  cadence: string;
  next_due_date: string | null;
}

/**
 * Get spending by category for a specific user
 */
export function getSpendingByCategory(
  userId: number,
  categoryName: string,
  days: number
): SpendingResult {
  const db = getDB();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const result = db.prepare(`
    SELECT
      c.name AS category,
      SUM(t.amount_cents) AS total_cents
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE
      t.user_id = ?
      AND c.name = ?
      AND t.type = 'debit'
      AND t.status = 'posted'
      AND t.posted_at BETWEEN ? AND ?
    GROUP BY c.name
  `).get(userId, categoryName, startDate.toISOString(), endDate.toISOString()) as { category: string; total_cents: number } | undefined;

  return {
    category: categoryName,
    total_cny: (result?.total_cents || 0) / 100,
    period_days: days,
  };
}

/**
 * Get all spending categories for a user in a time period
 */
export function getAllCategorySpending(
  userId: number,
  days: number
): Array<{ category: string; total_cny: number }> {
  const db = getDB();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const results = db.prepare(`
    SELECT
      c.name AS category,
      SUM(t.amount_cents) AS total_cents
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE
      t.user_id = ?
      AND t.type = 'debit'
      AND t.status = 'posted'
      AND t.posted_at BETWEEN ? AND ?
    GROUP BY c.name
    ORDER BY total_cents DESC
  `).all(userId, startDate.toISOString(), endDate.toISOString()) as Array<{ category: string; total_cents: number }>;

  return results.map(row => ({
    category: row.category,
    total_cny: row.total_cents / 100,
  }));
}

/**
 * Calculate account balances by summing transactions
 */
export function getAccountBalances(userId: number): AccountBalance[] {
  const db = getDB();
  
  const rows = db.prepare(`
    SELECT
      a.id,
      a.name,
      a.type,
      a.account_number_mask,
      COALESCE(SUM(CASE
        WHEN t.type = 'debit' THEN -t.amount_cents
        WHEN t.type = 'credit' THEN t.amount_cents
        ELSE 0
      END), 0) AS balance_cents
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.account_id AND t.status = 'posted'
    WHERE a.user_id = ?
    GROUP BY a.id, a.name, a.type, a.account_number_mask
  `).all(userId) as AccountBalance[];

  return rows.map((row) => ({
    ...row,
    balance_cny: row.balance_cents / 100,
  }));
}

/**
 * Get recent transactions for a user
 */
export function getRecentTransactions(
  userId: number,
  limit: number = 10
): Transaction[] {
  const db = getDB();
  
  const rows = db.prepare(`
    SELECT
      t.id,
      t.amount_cents,
      t.description,
      t.type,
      t.posted_at,
      m.name AS merchant_name,
      c.name AS category_name
    FROM transactions t
    LEFT JOIN merchants m ON t.merchant_id = m.id
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.status = 'posted'
    ORDER BY t.posted_at DESC
    LIMIT ?
  `).all(userId, limit) as Array<{
    id: number;
    amount_cents: number;
    description: string;
    merchant_name: string | null;
    category_name: string | null;
    posted_at: string;
    type: string;
  }>;

  return rows.map(row => ({
    ...row,
    amount_cny: row.amount_cents / 100,
  }));
}

/**
 * Get monthly spending summary
 */
export function getMonthlySpending(
  userId: number,
  months: number = 6
): MonthlySpending[] {
  const db = getDB();
  
  const rows = db.prepare(`
    SELECT
      year_month,
      spend_cny,
      income_cny
    FROM v_monthly_spend
    WHERE user_id = ?
    ORDER BY year_month DESC
    LIMIT ?
  `).all(userId, months) as Array<{
    year_month: string;
    spend_cny: number;
    income_cny: number;
  }>;

  return rows.map(row => ({
    ...row,
    net_cny: row.income_cny - row.spend_cny,
  }));
}

/**
 * Get recurring transactions
 */
export function getRecurringTransactions(userId: number): RecurringTransaction[] {
  const db = getDB();
  
  const rows = db.prepare(`
    SELECT
      rg.id,
      rg.name AS recurring_name,
      rg.cadence,
      rg.next_due_date,
      AVG(t.amount_cents) AS avg_amount_cents,
      m.name AS merchant_name
    FROM recurring_groups rg
    LEFT JOIN transactions t ON t.recurring_group_id = rg.id
    LEFT JOIN merchants m ON rg.merchant_id = m.id
    WHERE rg.user_id = ? AND rg.is_active = 1
    GROUP BY rg.id, rg.name, rg.cadence, rg.next_due_date, m.name
  `).all(userId) as Array<{
    id: number;
    recurring_name: string;
    avg_amount_cents: number;
    merchant_name: string | null;
    cadence: string;
    next_due_date: string | null;
  }>;

  return rows.map(row => ({
    ...row,
    amount_cny: row.avg_amount_cents / 100,
  }));
}

/**
 * Search transactions by text
 */
export function searchTransactions(
  userId: number,
  searchTerm: string,
  limit: number = 10
): Transaction[] {
  const db = getDB();
  
  const rows = db.prepare(`
    SELECT
      t.id,
      t.amount_cents,
      t.description,
      t.type,
      t.posted_at,
      m.name AS merchant_name,
      c.name AS category_name
    FROM transactions t
    LEFT JOIN merchants m ON t.merchant_id = m.id
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
      AND t.status = 'posted'
      AND t.id IN (
        SELECT rowid FROM tx_fts WHERE tx_fts MATCH ?
      )
    ORDER BY t.posted_at DESC
    LIMIT ?
  `).all(userId, searchTerm, limit) as Array<{
    id: number;
    amount_cents: number;
    description: string;
    merchant_name: string | null;
    category_name: string | null;
    posted_at: string;
    type: string;
  }>;

  return rows.map(row => ({
    ...row,
    amount_cny: row.amount_cents / 100,
  }));
}
