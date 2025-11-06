export function FinancialToolsCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Financial Tools</h2>
          <p className="mt-1 text-sm text-slate-500">
            Explore tools to manage your finances.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          View Tools
        </button>
      </header>
    </section>
  );
}
