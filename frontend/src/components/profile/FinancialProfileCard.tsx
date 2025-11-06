type FinancialProfileCardProps = {
  profileName: string;
  profileSummary: string;
};

export function FinancialProfileCard({
  profileName,
  profileSummary,
}: FinancialProfileCardProps) {
  return (
    <section className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-medium uppercase text-slate-400">
        Avatar
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-900">Financial Profile</h3>
        <p className="mt-1 text-xs text-slate-500">Revised Financial Profile:</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{profileName}</p>
        <p className="mt-2 text-sm text-slate-500">{profileSummary}</p>
      </div>
    </section>
  );
}
