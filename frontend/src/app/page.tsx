// "use client";

// import { FreedomTrackerCard } from "@/components/home/FreedomTrackerCard";
// import { HomeHeader } from "@/components/home/HomeHeader";
// import { InsightsRail } from "@/components/home/InsightsRail";
// import { RecurringCostTrackerCard } from "@/components/home/RecurringCostTrackerCard";
// import { BottomNav } from "@/components/layout/BottomNav";
// import { useEffect, useState } from "react";

// // Source of truth comes from backend now
// type InsightCard = {
//   id: string;
//   amount: string;
//   description: string;
//   subDescription: string;
// };

// // Format currency the same way everywhere
// const fmt = (n: number | null | undefined) =>
//   typeof n === "number" && !Number.isNaN(n)
//     ? n.toLocaleString(undefined, { style: "currency", currency: "CNY", maximumFractionDigits: 2 })
//     : "$0";


// export default function Home() {
//   const [insightCards, setInsightCards] = useState<InsightCard[] | null>(null);
//   const [balance, setBalance] = useState<string>("$—"); // NEW
//   const [error, setError] = useState<string | null>(null);
//   const [freedomMonths, setFreedomMonths] = useState<number | null>(null);


//   // Read from env when possible; default to localhost:8000
//   const API_BASE =
//     process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/insights`, { cache: "no-store" });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const d = await res.json(); // rich insights payload from backend

//         // ✅ Update header balance from backend totals.net
//         setBalance(fmt(d?.totals?.net));

//         const net = Number(d?.totals?.net ?? 0);
//         const avgMonthlyExpense = Number(d?.totals?.avg_monthly_expense ?? 0);
//         setFreedomMonths(avgMonthlyExpense > 0 ? net / avgMonthlyExpense : null);


//         const cards: InsightCard[] = [
//           {
//             id: "income", 
//             amount: fmt(d?.totals?.income),
//             description: "Total income",
//             subDescription: "All time",
//           },
//           {
//             id: "expenses",
//             amount: fmt(d?.totals?.expenses),
//             description: "Total expenses",
//             subDescription: "All time",
//           },
//           {
//             id: "net",
//             amount: fmt(d?.totals?.net),
//             description: "Net",
//             subDescription: "Income − Expenses",
//           },
//           {
//             id: "latest-month",
//             amount: fmt(d?.latest_month?.net ?? 0),
//             description: `Latest month (${d?.latest_month?.month ?? "—"})`,
//             subDescription: `Inc ${fmt(d?.latest_month?.income ?? 0)} / Exp ${fmt(d?.latest_month?.expenses ?? 0)}`,
//           },
//           {
//             id: "top-category",
//             amount: fmt(d?.top_categories?.[0]?.spend ?? 0),
//             description: "Top category (spend)",
//             subDescription: d?.top_categories?.[0]?.name ?? "—",
//           },
//           {
//             id: "top-merchant",
//             amount: fmt(d?.top_merchants?.[0]?.spend ?? 0),
//             description: "Top merchant (spend)",
//             subDescription: d?.top_merchants?.[0]?.name ?? "—",
//           },
//           {
//             id: "biggest-expense-30d",
//             amount: fmt(d?.biggest_expense_30d?.amount ?? 0),
//             description: "Biggest expense (30d)",
//             subDescription: `${d?.biggest_expense_30d?.category ?? "—"} · ${d?.biggest_expense_30d?.merchant ?? "—"}`,
//           },
//         ];

//         setInsightCards(cards);
//       } catch (e: any) {
//         setError(e?.message || "Failed to load insights");
//       }
//     })();
//   }, [API_BASE]);

//   return (
//     <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
//       <HomeHeader balance={balance} />


//       <main className="relative z-10 flex-1 bg-gray-100">
//         <InsightsRail
//           items={
//             insightCards ??
//             [
//               // graceful skeleton/fallback
//               { id: "loading", amount: "$—", description: "Loading…", subDescription: "…" },
//             ]
//           }
//         />

//         {error && (
//           <div className="mx-auto my-4 w-full max-w-3xl px-6">
//             <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
//               Failed to load insights: {error}
//             </div>
//           </div>
//         )}

//         <section className="relative mx-auto w-full max-w-3xl px-6 pb-20">
//           <div className="space-y-6">
//             <RecurringCostTrackerCard />
//             <FreedomTrackerCard months={freedomMonths} />
//             {/* <FinancialToolsCard /> */}
//           </div>
//         </section>
//       </main>

//       <BottomNav />
//     </div>
//   );
// }
// //   /*return (
// //     <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
// //       <HomeHeader balance="$1,200" />

// //       <main className="relative z-10 flex-1 bg-gray-100">
// //         <InsightsRail items={insightCards} />

// //         <section className="relative mx-auto w-full max-w-3xl px-6 pb-20">
// //           <div className="space-y-6">
// //             <RecurringCostTrackerCard />
// //             <FreedomTrackerCard />
// //             <FinancialToolsCard />
// //           </div>
// //         </section>
// //       </main>

// //       <BottomNav />
// //     </div>
// //   );
// // }*/

"use client";

import { FreedomTrackerCard } from "@/components/home/FreedomTrackerCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { InsightsRail } from "@/components/home/InsightsRail";
import { RecurringCostTrackerCard } from "@/components/home/RecurringCostTrackerCard";
import { SavingsCoachCard } from "@/components/home/SavingsCoachCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { useEffect, useState } from "react";

// Source of truth comes from backend now
type InsightCard = {
  id: string;
  amount: string;
  description: string;
  subDescription: string;
};

// Format currency the same way everywhere
const fmt = (n: number | null | undefined) =>
  typeof n === "number" && !Number.isNaN(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "CNY", maximumFractionDigits: 2 })
    : "$0";


export default function Home() {
  const [insightCards, setInsightCards] = useState<InsightCard[] | null>(null);
  const [balance, setBalance] = useState<string>("$—"); // NEW
  const [error, setError] = useState<string | null>(null);
  const [freedomMonths, setFreedomMonths] = useState<number | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(5000);
  const [currentlySaving, setCurrentlySaving] = useState<number>(0);
  const [baseSavings, setBaseSavings] = useState<number>(0);
  const [extraRecurringSavings, setExtraRecurringSavings] = useState<number>(0);

  useEffect(() => {
  setCurrentlySaving(Math.max(baseSavings + extraRecurringSavings, 0));
}, [baseSavings, extraRecurringSavings]);


  // Read from env when possible; default to localhost:8000
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/insights`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const d = await res.json(); // rich insights payload from backend

        // ✅ Update header balance from backend totals.net
        setBalance(fmt(d?.totals?.net));

        const avgMonthlyExpense = Number(d?.totals?.avg_monthly_expense ?? 0);
        setFreedomMonths(avgMonthlyExpense > 0 ? Number(d?.totals?.net ?? 0) / avgMonthlyExpense : null);

        // --- Base savings = 20% of the latest month net ---
        const latestNet = Number(d?.latest_month?.net ?? 0);
        const base = Math.max(latestNet * 0.8, 0);
        setBaseSavings(base);

        // const net = Number(d?.totals?.net ?? 0);
        // const avgMonthlyExpense = Number(d?.totals?.avg_monthly_expense ?? 0);
        // const monthsObserved = Number(d?.totals?.months_observed ?? 1);

        // setFreedomMonths(avgMonthlyExpense > 0 ? net / avgMonthlyExpense : null);

        // // --- Base savings = 20% of average monthly net ---
        // const monthlyNet = monthsObserved > 0 ? net / monthsObserved : 0;
        // const base = 0.2 * monthlyNet;
        // setBaseSavings(base);

        const cards: InsightCard[] = [
          {
            id: "income", 
            amount: fmt(d?.totals?.income),
            description: "Total income",
            subDescription: "All time",
          },
          {
            id: "expenses",
            amount: fmt(d?.totals?.expenses),
            description: "Total expenses",
            subDescription: "All time",
          },
          {
            id: "net",
            amount: fmt(d?.totals?.net),
            description: "Net",
            subDescription: "Income − Expenses",
          },
          {
            id: "latest-month",
            amount: fmt(d?.latest_month?.net ?? 0),
            description: `Latest month (${d?.latest_month?.month ?? "—"})`,
            subDescription: `Inc ${fmt(d?.latest_month?.income ?? 0)} / Exp ${fmt(d?.latest_month?.expenses ?? 0)}`,
          },
          {
            id: "top-category",
            amount: fmt(d?.top_categories?.[0]?.spend ?? 0),
            description: "Top category (spend)",
            subDescription: d?.top_categories?.[0]?.name ?? "—",
          },
          {
            id: "top-merchant",
            amount: fmt(d?.top_merchants?.[0]?.spend ?? 0),
            description: "Top merchant (spend)",
            subDescription: d?.top_merchants?.[0]?.name ?? "—",
          },
          {
            id: "biggest-expense-30d",
            amount: fmt(d?.biggest_expense_30d?.amount ?? 0),
            description: "Biggest expense (30d)",
            subDescription: `${d?.biggest_expense_30d?.category ?? "—"} · ${d?.biggest_expense_30d?.merchant ?? "—"}`,
          },
        ];

        setInsightCards(cards);
      } catch (e: any) {
        setError(e?.message || "Failed to load insights");
      }
    })();
  }, [API_BASE]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <HomeHeader balance={balance} />


      <main className="relative z-10 flex-1 bg-slate-50">
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
            {/* Savings Coach - New */}
            <SavingsCoachCard
              monthlyGoal={monthlyGoal}
              currentlySaving={currentlySaving}
              currency="CNY"
            />
            
            <RecurringCostTrackerCard
              onExtraSavingsChange={setExtraRecurringSavings}
            />

            <FreedomTrackerCard months={freedomMonths} />
            {/* <FinancialToolsCard /> */}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}