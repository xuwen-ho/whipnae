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
}
