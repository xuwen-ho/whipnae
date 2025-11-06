"use client";

import { useState } from "react";

const recurringItems = [
  { id: "daily-coffee", name: "Daily Coffee", cadence: "Daily" },
  { id: "streamverse", name: "StreamVerse", cadence: "Monthly" },
  { id: "musicflow", name: "MusicFlow", cadence: "Monthly" },
];

export function RecurringCostTrackerCard() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of recurringItems) {
      initial[item.id] = false;
    }
    return initial;
  });

  const toggle = (id: string) => {
    setEnabled((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Recurring Cost Tracker
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your monthly subscriptions and recurring bills.
        </p>
      </header>

      <ul className="mt-6 space-y-4">
        {recurringItems.map((item) => {
          const isOn = enabled[item.id];

          return (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {item.name}
                </span>
                <span className="text-xs text-slate-500">{item.cadence}</span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                onClick={() => toggle(item.id)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isOn ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isOn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
