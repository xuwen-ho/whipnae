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
        className={`accessibility-toggle relative flex h-8 w-16 flex-shrink-0 items-center rounded-full border-2 transition-colors duration-200 ${
          isOn ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
        }`}
      >
        <span
          className={`absolute left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
            isOn ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
