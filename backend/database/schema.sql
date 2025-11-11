PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('checking','savings','credit_card')) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CNY',
  institution TEXT,
  account_number_mask TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INTEGER,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  mcc TEXT,
  category_default_id INTEGER,
  website TEXT,
  country TEXT,
  FOREIGN KEY (category_default_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS recurring_groups (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  merchant_id INTEGER,
  category_id INTEGER,
  cadence TEXT NOT NULL,
  day_of_month INTEGER,
  weekday INTEGER,
  next_due_date TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  merchant_id INTEGER,
  category_id INTEGER,
  type TEXT CHECK(type IN ('debit','credit','transfer')) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CNY',
  description TEXT,
  status TEXT CHECK(status IN ('pending','posted','reversed')) NOT NULL DEFAULT 'posted',
  created_at TEXT NOT NULL,
  posted_at TEXT,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  recurring_group_id INTEGER,
  channel TEXT CHECK(channel IN ('card','ach','wire','cash','online','cheque')),
  latitude REAL,
  longitude REAL,
  raw_text TEXT,
  external_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (recurring_group_id) REFERENCES recurring_groups(id)
);

CREATE TABLE IF NOT EXISTS transfers (
  id INTEGER PRIMARY KEY,
  from_account_id INTEGER NOT NULL,
  to_account_id INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  description TEXT,
  external_id TEXT,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS tx_fts USING fts5(
  description, raw_text, merchantname, content='transactions', content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS tx_ai AFTER INSERT ON transactions BEGIN
  INSERT INTO tx_fts(rowid, description, raw_text, merchantname)
  SELECT new.id, new.description, new.raw_text,
         COALESCE((SELECT name FROM merchants WHERE id=new.merchant_id),'') ;
END;

CREATE TRIGGER IF NOT EXISTS tx_ad AFTER DELETE ON transactions BEGIN
  INSERT INTO tx_fts(tx_fts, rowid, description, raw_text, merchantname)
  VALUES('delete', old.id, '', '', '');
END;

CREATE TRIGGER IF NOT EXISTS tx_au AFTER UPDATE ON transactions BEGIN
  INSERT INTO tx_fts(tx_fts, rowid, description, raw_text, merchantname) VALUES('delete', old.id, '', '', '');
  INSERT INTO tx_fts(rowid, description, raw_text, merchantname)
  SELECT new.id, new.description, new.raw_text,
         COALESCE((SELECT name FROM merchants WHERE id=new.merchant_id),'') ;
END;

CREATE VIEW IF NOT EXISTS v_monthly_spend AS
SELECT user_id, strftime('%Y-%m', posted_at) AS year_month,
       SUM(CASE WHEN type='debit' THEN amount_cents ELSE 0 END)/100.0 AS spend_cny,
       SUM(CASE WHEN type='credit' THEN amount_cents ELSE 0 END)/100.0 AS income_cny
FROM transactions
WHERE status='posted'
GROUP BY 1,2;

CREATE VIEW IF NOT EXISTS v_recurring AS
SELECT t.*, rg.name AS recurring_name
FROM transactions t
LEFT JOIN recurring_groups rg ON rg.id = t.recurring_group_id
WHERE t.is_recurring=1;
