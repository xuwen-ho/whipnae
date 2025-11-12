type FinancialProfileCardProps = {
  userName?: string;
  profileName: string;
  profileSummary: string;
  riskScore?: number;
  knowledgeLevel?: string;
  aiInsights?: string[];
  personalizationSummary?: string;
  isLoadingInsights?: boolean;
  onRegenerateInsights?: () => void;
};

export function FinancialProfileCard({
  userName,
  profileName,
  profileSummary,
  riskScore,
  knowledgeLevel,
  aiInsights,
  personalizationSummary,
  isLoadingInsights,
  onRegenerateInsights,
}: FinancialProfileCardProps) {
  const displayTitle = userName ? `${userName}'s Financial Profile` : 'Financial Profile';

  return (
    <section className="space-y-4">
      {/* Profile Summary */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-medium uppercase text-slate-400">
            Avatar
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">{displayTitle}</h3>
            <p className="mt-1 text-xs text-slate-500">Revised Financial Profile:</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profileName}</p>
            <p className="mt-2 text-sm text-slate-500">{profileSummary}</p>

            {/* Risk Score & Knowledge */}
            {(riskScore !== undefined || knowledgeLevel) && (
              <div className="mt-3 flex gap-4 text-xs text-slate-600">
                {riskScore !== undefined && (
                  <span>Risk Score: <strong>{riskScore}/10</strong></span>
                )}
                {knowledgeLevel && (
                  <span>Knowledge: <strong>{knowledgeLevel}</strong></span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm ring-1 ring-blue-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <h4 className="text-base font-semibold text-slate-900">
            Personalized Insights for {userName || 'You'}
          </h4>
        </div>

        {isLoadingInsights ? (
          <div className="mt-4 space-y-2">
            <div className="h-4 animate-pulse rounded bg-slate-200"></div>
            <div className="h-4 animate-pulse rounded bg-slate-200"></div>
            <div className="h-4 animate-pulse rounded bg-slate-200"></div>
          </div>
        ) : aiInsights && aiInsights.length > 0 ? (
          <>
            <div className="mt-4 space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="flex-1 text-sm text-slate-700">{insight}</p>
                </div>
              ))}
            </div>

            {personalizationSummary && (
              <p className="mt-4 text-xs italic text-slate-500">
                {personalizationSummary}
              </p>
            )}

            {onRegenerateInsights && (
              <button
                onClick={onRegenerateInsights}
                className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Regenerate Insights
              </button>
            )}
          </>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-600">
              Get AI-powered personalized financial insights based on your profile.
            </p>
            {onRegenerateInsights && (
              <button
                onClick={onRegenerateInsights}
                className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Generate Insights
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
