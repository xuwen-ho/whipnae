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
