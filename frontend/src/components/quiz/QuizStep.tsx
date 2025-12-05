import type { QuizStep as QuizStepType, PartialQuizResponse } from '@/lib/quiz_v2/types';
import { QuestionCard } from './QuestionTypes/QuestionCard';
import { SingleSelect } from './QuestionTypes/SingleSelect';
import { MultiSelect } from './QuestionTypes/MultiSelect';
import { TextInput } from './QuestionTypes/TextInput';

type QuizStepProps = {
  step: QuizStepType;
  responses: PartialQuizResponse;
  errors: Record<string, string>;
  onResponseChange: (questionId: string, value: string | string[]) => void;
};

export function QuizStep({ step, responses, errors, onResponseChange }: QuizStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
        <p className="mt-2 text-slate-600">{step.description}</p>
      </div>

      <div className="space-y-8">
        {step.questions.map((question) => {
          const value = (responses as any)[question.id];
          const error = (errors as any)[question.id];

          return (
            <QuestionCard
              key={question.id}
              title={question.title}
              description={question.description}
              required={question.required}
              error={error}
            >
              {question.type === 'text-input' ? (
                <TextInput
                  question={question}
                  value={value as string}
                  onChange={(newValue) => onResponseChange(question.id, newValue)}
                  error={error}
                />
              ) : question.type === 'single-select' ? (
                <SingleSelect
                  options={question.options}
                  value={value as string | undefined}
                  onChange={(newValue) => onResponseChange(question.id, newValue)}
                  name={question.id}
                />
              ) : (
                <MultiSelect
                  options={question.options}
                  value={value as string[] | undefined}
                  onChange={(newValue) => onResponseChange(question.id, newValue)}
                  maxSelections={question.maxSelections}
                />
              )}
            </QuestionCard>
          );
        })}
      </div>
    </div>
  );
}
