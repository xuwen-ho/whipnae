export function FreedomTrackerCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Freedom Tracker</h2>
        <p className="mt-1 text-sm text-slate-500">
          See how long your savings can cover your expenses.
        </p>
      </header>

      <div className="mt-6 rounded-2xl bg-blue-50 p-6 text-blue-900">
        <span className="text-sm font-medium uppercase tracking-wide">
          4.2 Months of Freedom
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Your savings can cover your expenses for this long.
      </p>
    </section>
  );
}
