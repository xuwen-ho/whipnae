"use client";

import { FinancialToolsCard } from "@/components/home/FinancialToolsCard";
import { FreedomTrackerCard } from "@/components/home/FreedomTrackerCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { InsightsRail } from "@/components/home/InsightsRail";
import { RecurringCostTrackerCard } from "@/components/home/RecurringCostTrackerCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { useEffect, useState } from "react";

// jovan change this data to fetch fr backend api
// const insightCards = [
//   {
//     id: "ai-expenses",
//     amount: "$12,000",
//     description: "AI-detected expenses",
//     subDescription: "10-Year Growth Potential",
//   },
// ];

// Source of truth comes from backend now
type InsightCard = {
  id: string;
  amount: string;
  description: string;
  subDescription: string;
};

export default function Home() {
  const [insightCards, setInsightCards] = useState<InsightCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read from env when possible; default to localhost:8000
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/insights`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as InsightCard[];
        setInsightCards(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load insights");
      }
    })();
  }, [API_BASE]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <HomeHeader balance="$1,200" />

      <main className="relative z-10 flex-1 bg-gray-100">
        <InsightsRail
          items={
            insightCards ??
            [
              // graceful skeleton/fallback
              { id: "loading", amount: "$—", description: "Loading…", subDescription: "…" },
            ]
          }
        />

        {error && (
          <div className="mx-auto my-4 w-full max-w-3xl px-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              Failed to load insights: {error}
            </div>
          </div>
        )}

        <section className="relative mx-auto w-full max-w-3xl px-6 pb-20">
          <div className="space-y-6">
            <RecurringCostTrackerCard />
            <FreedomTrackerCard />
            <FinancialToolsCard />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
  /*return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <HomeHeader balance="$1,200" />

      <main className="relative z-10 flex-1 bg-gray-100">
        <InsightsRail items={insightCards} />

        <section className="relative mx-auto w-full max-w-3xl px-6 pb-20">
          <div className="space-y-6">
            <RecurringCostTrackerCard />
            <FreedomTrackerCard />
            <FinancialToolsCard />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}*/
