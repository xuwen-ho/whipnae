type SettingsToggleItemProps = {
  label: string;
  description: string;
  isOn: boolean;
  onToggle: () => void;
};

export function SettingsToggleItem({
  label,
  description,
  isOn,
  onToggle,
}: SettingsToggleItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
      <div className="mr-4 flex-1">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={onToggle}
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
    </div>
  );
}
