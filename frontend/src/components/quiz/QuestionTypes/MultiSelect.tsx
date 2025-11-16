import type { QuestionOption } from '@/lib/quiz/types';

type MultiSelectProps = {
  options: QuestionOption[];
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  maxSelections?: number;
};

export function MultiSelect({ options, value = [], onChange, maxSelections }: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    const currentValues = value || [];
    const isSelected = currentValues.includes(optionValue);

    if (isSelected) {
      // Remove the value
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      // Add the value (if under max limit)
      if (!maxSelections || currentValues.length < maxSelections) {
        onChange([...currentValues, optionValue]);
      }
    }
  };

  const isMaxReached = maxSelections ? (value?.length || 0) >= maxSelections : false;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value?.includes(option.value);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <label
              key={option.value}
              className={`
                flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all
                ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : isDisabled
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-50'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }
              `}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={isDisabled}
                className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{option.label}</div>
                {option.description && <div className="mt-1 text-sm text-slate-600">{option.description}</div>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
