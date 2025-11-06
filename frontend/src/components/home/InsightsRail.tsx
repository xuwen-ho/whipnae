type InsightCard = {
  id: string;
  amount: string;
  description: string;
  subDescription: string;
};

type InsightsRailProps = {
  items: InsightCard[];
};

export function InsightsRail({ items }: InsightsRailProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative z-30 mt-8 pb-8">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4">
            {items.map((card) => (
              <article
                key={card.id}
                className="min-w-[260px] flex-1 rounded-3xl bg-white p-6 shadow-md"
              >
                <p className="text-2xl font-semibold text-slate-900">
                  {card.amount}
                </p>
                <p className="mt-3 text-sm font-medium text-blue-700">
                  {card.description}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {card.subDescription}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
