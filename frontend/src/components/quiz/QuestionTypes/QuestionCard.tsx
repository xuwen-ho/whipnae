type QuestionCardProps = {
  title: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function QuestionCard({ title, description, required, error, children }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </h3>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
