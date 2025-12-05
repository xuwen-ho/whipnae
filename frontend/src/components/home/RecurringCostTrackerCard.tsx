// "use client";

// import { useState } from "react";

// const recurringItems = [
//   { id: "daily-coffee", name: "Daily Coffee", cadence: "Daily" },
//   { id: "streamverse", name: "StreamVerse", cadence: "Monthly" },
//   { id: "musicflow", name: "MusicFlow", cadence: "Monthly" },
// ];

// export function RecurringCostTrackerCard() {
//   const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
//     const initial: Record<string, boolean> = {};
//     for (const item of recurringItems) {
//       initial[item.id] = false;
//     }
//     return initial;
//   });

//   const toggle = (id: string) => {
//     setEnabled((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <section className="rounded-3xl bg-white p-6 shadow-sm">
//       <header>
//         <h2 className="text-lg font-semibold text-slate-900">
//           Recurring Cost Tracker
//         </h2>
//         <p className="mt-1 text-sm text-slate-500">
//           Track your monthly subscriptions and recurring bills.
//         </p>
//       </header>

//       <ul className="mt-6 space-y-4">
//         {recurringItems.map((item) => {
//           const isOn = enabled[item.id];

//           return (
//             <li
//               key={item.id}
//               className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
//             >
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-slate-900">
//                   {item.name}
//                 </span>
//                 <span className="text-xs text-slate-500">{item.cadence}</span>
//               </div>

//               <button
//                 type="button"
//                 role="switch"
//                 aria-checked={isOn}
//                 onClick={() => toggle(item.id)}
//                 className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
//                   isOn ? "bg-blue-600" : "bg-slate-300"
//                 }`}
//               >
//                 <span
//                   className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
//                     isOn ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//     </section>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";

// Shared currency format
// Shared currency format (now per-item currency)
const fmt = (n: number | null | undefined, currency = "CNY") =>
  typeof n === "number" && !Number.isNaN(n)
    ? n.toLocaleString(undefined, { style: "currency", currency, maximumFractionDigits: 2 })
    : new Intl.NumberFormat(undefined, { style: "currency", currency }).format(0);


// Read from env; fallback to localhost
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

type RecurringItem = {
  id: number;
  name: string;
  cadence: "Daily" | "Weekly" | "Monthly" | "Yearly" | string;
  amount: number;
  currency: string;
  recurring: 0 | 1; // 1 = ON
  notes?: string;
};

type RecurringCostTrackerProps = {
  onExtraSavingsChange?: (extraPerMonth: number) => void;
};

const toMonthlyAmount = (amount: number, cadence: string): number => {
  switch (cadence) {
    case "Daily":
      return amount * (365.25 / 12);  // ≈ 30.4 days
    case "Weekly":
      return amount * (52 / 12);      // ≈ 4.33 weeks
    case "Monthly":
      return amount;
    case "Yearly":
      return amount / 12;
    default:
      return amount;
  }
};


export function RecurringCostTrackerCard({ onExtraSavingsChange }: RecurringCostTrackerProps) {
  const [items, setItems] = useState<RecurringItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/recurring`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load recurring costs");
      }
    })();
  }, []);

  // Totals by currency for items that are ON (recurring === 1)
  const totalsByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of items || []) {
      if (r.recurring !== 1) continue;
      map.set(r.currency, (map.get(r.currency) || 0) + (r.amount || 0));
    }
    return Array.from(map.entries()); // [ [currency, total], ... ]
  }, [items]);

  const totalOn = useMemo(
    () => (items || []).filter(i => i.recurring === 1).reduce((s, i) => s + (i.amount || 0), 0),
    [items]
  );

  // Extra savings per month from items that are OFF (recurring === 0)
  const extraSavingsFromOff = useMemo(() => {
    if (!items) return 0;
    return items
      .filter(i => i.recurring === 0)
      .reduce((sum, i) => sum + toMonthlyAmount(i.amount || 0, i.cadence), 0);
  }, [items]);

  useEffect(() => {
    if (onExtraSavingsChange) {
      onExtraSavingsChange(extraSavingsFromOff);
    }
  }, [extraSavingsFromOff, onExtraSavingsChange]);


  const toggle = async (item: RecurringItem) => {
    const next = item.recurring === 1 ? 0 : 1;
    // optimistic
    setItems(prev => prev?.map(i => (i.id === item.id ? { ...i, recurring: next } : i)) || prev);
    try {
      const res = await fetch(`${API_BASE}/recurring/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recurring: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setItems(prev => prev?.map(i => (i.id === item.id ? updated : i)) || prev);
    } catch {
      // revert on failure
      setItems(prev => prev?.map(i => (i.id === item.id ? { ...i, recurring: item.recurring } : i)) || prev);
      setError("Failed to toggle item");
    }
  };

  const saveAmount = async (item: RecurringItem, amountStr: string) => {
    const num = Number(amountStr);
    if (Number.isNaN(num)) return;
    setSavingId(item.id);
    // optimistic update
    setItems(prev => prev?.map(i => (i.id === item.id ? { ...i, amount: num } : i)) || prev);
    try {
      const res = await fetch(`${API_BASE}/recurring/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setItems(prev => prev?.map(i => (i.id === item.id ? updated : i)) || prev);
    } catch {
      setError("Failed to save amount");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Recurring Cost Tracker</h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your subscriptions and recurring bills from the backend.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">Total ON:</span>
          {totalsByCurrency.length === 0 ? (
            <span className="text-slate-500">0</span>
          ) : (
            totalsByCurrency.map(([cur, total]) => (
              <span key={cur} className="rounded-full bg-slate-100 px-2 py-0.5">
                {fmt(total, cur)}
              </span>
            ))
          )}
        </div>

      </header>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {(items || []).map((item) => {
          const isOn = item.recurring === 1;
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex flex-col truncate">
                  <span className="truncate text-sm font-medium text-slate-900">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.cadence}</span>
                </div>

                {/* Editable amount */}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-500">{item.currency}</span>

                  <input
                    type="number"
                    step="0.01"
                    defaultValue={item.amount}
                    onBlur={(e) => saveAmount(item, e.currentTarget.value)}
                    className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right text-sm"
                    aria-label={`${item.name} amount`}
                  />
                  {savingId === item.id && (
                    <span className="text-xs text-slate-500">Saving…</span>
                  )}
                </div>
              </div>

              {/* ON/OFF Toggle (recurring 1 → ON) */}
              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                onClick={() => toggle(item)}
                className={`relative ml-2 flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isOn ? "bg-blue-600" : "bg-slate-300"
                  }`}
              >
                <span
                  className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isOn ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Your exact use case */}
      <p className="mt-4 text-xs text-slate-500">
        Tip: If <em>Daily Coffee</em> isn’t really $6/day, click the amount to edit it, then toggle OFF to pause it.
      </p>


    </section>
  );
}
