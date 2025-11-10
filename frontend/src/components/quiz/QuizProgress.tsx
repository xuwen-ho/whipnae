type QuizProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-slate-500">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-all ${
              step < currentStep
                ? 'bg-blue-600'
                : step === currentStep
                  ? 'bg-blue-600'
                  : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
