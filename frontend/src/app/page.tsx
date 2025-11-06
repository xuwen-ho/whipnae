import { HomeHeader } from "@/components/home/HomeHeader";
import { InsightsRail } from "@/components/home/InsightsRail";
import { RecurringCostTrackerCard } from "@/components/home/RecurringCostTrackerCard";
import { FreedomTrackerCard } from "@/components/home/FreedomTrackerCard";
import { FinancialToolsCard } from "@/components/home/FinancialToolsCard";
import { BottomNav } from "@/components/layout/BottomNav";

// jovan change this data to fetch fr backend api
const insightCards = [
  {
    id: "ai-expenses",
    amount: "$12,000",
    description: "AI-detected expenses",
    subDescription: "10-Year Growth Potential",
  },
];

export default function Home() {
  return (
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
}
