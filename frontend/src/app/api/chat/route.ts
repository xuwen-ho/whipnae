import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { financialTools } from '@/lib/ai/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create OpenRouter provider instance
const openrouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter.chat('moonshotai/kimi-k2'),
    system: `You are a helpful financial assistant with access to the user's financial data. 
    
You can help users:
- Check account balances and spending
- Analyze spending by category
- Review recent transactions
- Track monthly trends
- Manage recurring payments/subscriptions
- Search for specific transactions

When providing financial information:
- Always format currency amounts clearly (e.g., ¥1,234.56)
- Provide context and insights, not just raw data
- Offer actionable advice when appropriate
- Be conversational and friendly

Use the available tools to access real financial data to answer user questions.`,
    messages: convertToModelMessages(messages),
    tools: financialTools,
  });

  return result.toUIMessageStreamResponse();
}