# AI Financial Assistant with Database Tools

## Overview

This implementation adds AI tools that allow the chat assistant to query your SQLite database and provide real-time financial insights.

## Architecture

### Files Created

1. **`lib/db/index.ts`** - Database connection manager
   - Initializes and manages SQLite connection
   - Uses `better-sqlite3` for synchronous database operations

2. **`lib/db/queries.ts`** - Database query functions
   - All SQL queries are defined here
   - Type-safe interfaces for query results
   - Functions for spending, balances, transactions, etc.

3. **`lib/ai/tools.ts`** - AI tool definitions
   - Wraps database queries as AI tools
   - Uses Zod for parameter validation
   - Provides tool descriptions for the AI

4. **`app/api/chat/route.ts`** - Updated chat API
   - Integrates tools with OpenRouter
   - Enhanced system prompt for financial assistance

## Available Tools

### 1. `getSpendingByCategory`
Get spending for a specific category over time.
```typescript
// Example: User asks "How much did I spend on food last month?"
{
  category: "Food",
  total_cny: 1234.56,
  period_days: 30
}
```

### 2. `getAllCategorySpending`
Get breakdown of spending across all categories.
```typescript
// Example: User asks "Show me my spending by category"
{
  categories: [
    { category: "Food", total_cny: 1234.56 },
    { category: "Transport", total_cny: 456.78 }
  ],
  period_days: 30
}
```

### 3. `getAccountBalances`
Get current balances for all accounts.
```typescript
// Example: User asks "What's my balance?"
{
  accounts: [
    {
      id: 1,
      name: "Checking",
      type: "checking",
      balance_cny: 5000.00
    }
  ],
  total_balance_cny: 5000.00
}
```

### 4. `getRecentTransactions`
Get recent transaction history.
```typescript
// Example: User asks "Show me my recent purchases"
{
  transactions: [
    {
      id: 1,
      amount_cny: 50.00,
      description: "Grocery store",
      merchant_name: "Walmart",
      category_name: "Food",
      posted_at: "2025-01-15T10:30:00Z",
      type: "debit"
    }
  ],
  count: 10
}
```

### 5. `getMonthlySpending`
Get monthly spending trends.
```typescript
// Example: User asks "How has my spending trended over the last few months?"
{
  monthly_data: [
    {
      year_month: "2025-01",
      spend_cny: 3000.00,
      income_cny: 5000.00,
      net_cny: 2000.00
    }
  ]
}
```

### 6. `getRecurringTransactions`
Get active subscriptions and recurring payments.
```typescript
// Example: User asks "What subscriptions do I have?"
{
  recurring_transactions: [
    {
      id: 1,
      recurring_name: "Netflix",
      amount_cny: 99.00,
      cadence: "monthly",
      next_due_date: "2025-02-01"
    }
  ],
  total_monthly_recurring: 299.00
}
```

### 7. `searchTransactions`
Search transactions by keyword (uses FTS).
```typescript
// Example: User asks "Find all Starbucks transactions"
{
  transactions: [ /* matching transactions */ ],
  count: 5,
  search_term: "Starbucks"
}
```

## How It Works

1. **User sends a message** - e.g., "What's my balance?"

2. **AI decides which tool(s) to use** - Based on the question, the AI determines it needs `getAccountBalances`

3. **Tool executes query** - The tool function runs the SQL query against your SQLite database

4. **AI formats response** - The AI receives the data and formats it into a natural language response

5. **User sees friendly answer** - e.g., "You have ¥5,000 in your Checking account. Your total balance is ¥5,000."

## Example Conversations

**User:** "How much did I spend on food last month?"
- AI calls: `getSpendingByCategory(categoryName: "Food", days: 30)`
- Response: "You spent ¥1,234.56 on food over the last 30 days."

**User:** "Show me my recent transactions"
- AI calls: `getRecentTransactions(limit: 10)`
- Response: Lists the 10 most recent transactions with details

**User:** "What subscriptions am I paying for?"
- AI calls: `getRecurringTransactions()`
- Response: Lists all active recurring payments with amounts

**User:** "Find my Starbucks purchases"
- AI calls: `searchTransactions(searchTerm: "Starbucks")`
- Response: Shows all Starbucks transactions

## Configuration

### User ID
Currently hardcoded to `DEFAULT_USER_ID = 1` in `lib/ai/tools.ts`.

In production, replace with:
```typescript
// Get from session/auth
const userId = await getUserIdFromSession(req);
```

### Database Path
Located at: `src/lib/db/transactions.db`

Change in `lib/db/index.ts` if needed:
```typescript
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db', 'transactions.db');
```

## Adding New Tools

To add a new tool:

1. **Add query function** in `lib/db/queries.ts`:
```typescript
export function getNewQuery(userId: number): Result[] {
  const db = getDB();
  return db.prepare(`SELECT...`).all(userId);
}
```

2. **Add tool definition** in `lib/ai/tools.ts`:
```typescript
export const financialTools = {
  // ... existing tools
  newTool: tool({
    description: 'What this tool does',
    parameters: z.object({
      param: z.string(),
    }),
    execute: async ({ param }) => {
      return getNewQuery(DEFAULT_USER_ID, param);
    },
  }),
};
```

3. **Tool is automatically available** to the AI!

## Testing

Test the tools by asking questions in the chat:
- "What's my balance?"
- "How much did I spend on food?"
- "Show my recent transactions"
- "What subscriptions do I have?"
- "Find all transactions at Walmart"

## Performance Notes

- Uses `better-sqlite3` for synchronous operations (faster than async for simple queries)
- Database connections are cached
- Full-text search enabled for transaction searching
- All monetary amounts stored as cents (integers) to avoid floating-point issues

## Security Considerations

- **User isolation**: All queries filter by `user_id`
- **SQL injection**: Using prepared statements
- **API rate limiting**: Consider adding in production
- **Authentication**: Add proper auth before production use

## Next Steps

1. Add user authentication
2. Implement rate limiting
3. Add error handling and logging
4. Create more specialized tools for budgeting, insights, etc.
5. Add caching for frequently accessed data
6. Implement real-time notifications for tool results
