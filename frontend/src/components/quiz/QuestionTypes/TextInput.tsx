import type { QuizQuestion } from '@/lib/quiz/types';

type TextInputProps = {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function TextInput({ question, value, onChange, error }: TextInputProps) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.description || 'Enter your answer'}
        className={`w-full rounded-xl border-2 px-6 py-4 text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          error
            ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400'
            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${question.id}-error` : undefined}
      />
      {error && (
        <p id={`${question.id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
