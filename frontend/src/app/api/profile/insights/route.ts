import { NextRequest, NextResponse } from 'next/server';
import { getSpendingInsights } from '@/lib/db/queries';

interface ProfileInsightsRequest {
  userName: string;
  profileType: string;
  profileName: string;
  riskScore: number;
  profileSummary: string;
  characteristics: {
    timeHorizon?: string;
    knowledgeLevel?: string;
    riskTolerance?: string;
    [key: string]: string | undefined;
  };
  recommendations: string[];
}

interface ProfileInsightsResponse {
  insights: string[];
  personalizationSummary: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProfileInsightsRequest = await request.json();

    // Validate required fields
    if (!body.userName || body.riskScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get API credentials from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 503 }
      );
    }

    // Get real spending data from database
    let spendingData;
    try {
      spendingData = getSpendingInsights(1); // Default user ID 1
      console.log('📊 Spending data fetched successfully:', {
        totalSpent: spendingData.totalSpent,
        totalIncome: spendingData.totalIncome,
        topCategoriesCount: spendingData.topCategories.length,
      });
    } catch (error) {
      console.error('❌ Error fetching spending data:', error);
      spendingData = null;
    }

    // Build enhanced prompt with quiz results and transaction data
    let prompt = `Provide 3 brief, personalized financial tips for ${body.userName} based on their profile and spending data.

FINANCIAL PROFILE (from quiz):
- Profile Type: ${body.profileName}
- Risk Score: ${body.riskScore}/10 (${body.characteristics.riskTolerance || 'moderate'} risk tolerance)
- Time Horizon: ${body.characteristics.timeHorizon || 'medium-term'}
- Knowledge Level: ${body.characteristics.knowledgeLevel || 'intermediate'}
- Profile Summary: ${body.profileSummary}

QUIZ RECOMMENDATIONS:
${body.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}`;

    if (spendingData) {
      const savingsRate = spendingData.totalIncome > 0
        ? ((spendingData.totalIncome - spendingData.totalSpent) / spendingData.totalIncome * 100)
        : 0;

      prompt += `

ACTUAL SPENDING DATA (last 6 months in Shenzhen, China):
💰 Financial Overview:
- Total Income: ¥${spendingData.totalIncome.toFixed(2)}
- Total Spent: ¥${spendingData.totalSpent.toFixed(2)}
- Net Balance: ¥${spendingData.netBalance.toFixed(2)}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Monthly Average: ¥${spendingData.monthlyAverage.toFixed(2)}/month
- Recurring Bills: ¥${spendingData.recurringExpenses.toFixed(2)}/month

📊 Top Spending Categories:
${spendingData.topCategories.map((c, i) => `${i + 1}. ${c.category}: ¥${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}% of total)`).join('\n')}

🏪 Most Frequent Merchants:
${spendingData.topMerchants.slice(0, 3).map((m, i) => `${i + 1}. ${m.merchant}: ¥${m.amount.toFixed(2)} (${m.count} transactions)`).join('\n')}`;
    }

    prompt += `

TASK: Generate 3 actionable financial insights that:
1. Connect their quiz profile/recommendations with actual spending behavior
2. Are specific to their situation (mention actual categories/amounts if relevant)
3. Help them achieve their financial goals based on their risk profile and time horizon

Return ONLY valid JSON in this exact format:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "personalizationSummary": "1-2 sentence summary explaining how these insights are personalized to ${body.userName}'s specific profile"
}

IMPORTANT: In the personalizationSummary, you MUST use "${body.userName}" as the person's name, their exact risk score of ${body.riskScore}/10, and mention their specific characteristics like ${body.characteristics.knowledgeLevel || 'intermediate'} knowledge level.

Keep each insight under 150 characters. Make them actionable and specific.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Whipnae Financial Assistant',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial advisor assistant providing personalized, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: `AI service error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || '';

    console.log('LLM Response:', responseText);

    // Parse JSON response from LLM
    let cleaned = responseText.trim();

    // Strip markdown code blocks if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }

    cleaned = cleaned.trim();

    try {
      const parsedData = JSON.parse(cleaned);
      let insights = parsedData.insights || [];
      const personalizationSummary = parsedData.personalizationSummary || '';

      // Validate we got 3 insights
      if (insights.length < 3) {
        while (insights.length < 3) {
          insights.push('Continue monitoring your financial goals and adjust as needed.');
        }
      }

      const result: ProfileInsightsResponse = {
        insights: insights.slice(0, 3),
        personalizationSummary: personalizationSummary ||
          `AI adapts recommendations to ${body.userName}'s ${body.characteristics.riskTolerance || 'unique'} risk profile`
      };

      return NextResponse.json(result);

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response was:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse LLM response. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
