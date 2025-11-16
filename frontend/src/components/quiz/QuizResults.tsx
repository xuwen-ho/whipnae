import type { FinancialProfile } from '@/lib/quiz/types';
import { FiCheckCircle } from 'react-icons/fi';

type QuizResultsProps = {
  profile: FinancialProfile;
  onRetake: () => void;
  onSave: () => void;
};

export function QuizResults({ profile, onRetake, onSave }: QuizResultsProps) {
  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <FiCheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Your Financial Profile is Ready!</h2>
        <p className="mt-2 text-slate-600">
          Based on your responses, we've created a personalized financial profile for you.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-blue-900">{profile.profileName}</h3>
          <div className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
            Risk Score: {profile.riskScore}/10
          </div>
        </div>
        <p className="text-slate-700">{profile.profileSummary}</p>
      </div>

      {/* Characteristics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-500">Risk Tolerance</div>
          <div className="mt-1 text-lg font-semibold capitalize text-slate-900">{profile.characteristics.riskTolerance}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-500">Time Horizon</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{profile.characteristics.timeHorizon}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-500">Savings Pattern</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{profile.characteristics.savingsPattern}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-500">Knowledge Level</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{profile.characteristics.knowledgeLevel}</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h4 className="text-lg font-semibold text-slate-900">Recommended Strategies</h4>
        <ul className="mt-4 space-y-3">
          {profile.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
              </div>
              <span className="text-slate-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onSave}
          className="flex-1 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Profile
        </button>
        <button
          onClick={onRetake}
          className="flex-1 rounded-full border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
