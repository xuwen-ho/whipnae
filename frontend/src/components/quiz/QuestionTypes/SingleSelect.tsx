import type { QuestionOption } from '@/lib/quiz_v2/types';

type SingleSelectProps = {
  options: QuestionOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
};

export function SingleSelect({ options, value, onChange, name }: SingleSelectProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className={`
              flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all
              ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{option.label}</div>
              {option.description && <div className="mt-1 text-sm text-slate-600">{option.description}</div>}
            </div>
          </label>
        );
      })}
    </div>
  );
}
