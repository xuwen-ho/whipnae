"use client";
import Link from "next/link";


interface SavingsCoachProps {
    monthlyGoal: number;
    currentlySaving: number;
    currency?: string;
}

export function SavingsCoachCard({
    monthlyGoal,
    currentlySaving,
    currency = "CNY",
}: SavingsCoachProps) {
    const percentage = monthlyGoal > 0 ? Math.min((currentlySaving / monthlyGoal) * 100, 100) : 0;
    const gapToGoal = Math.max(monthlyGoal - currentlySaving, 0);

    const fmt = (n: number) =>
        n.toLocaleString(undefined, {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        });

    return (
        <section className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm border border-blue-100">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Savings Coach</h2>
                <p className="mt-2 text-sm text-slate-600">
                    See if you're saving enough every month.
                </p>
            </header>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 text-center">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Goal</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{fmt(monthlyGoal)}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Currently Saving</p>
                    <p className="mt-2 text-xl font-bold text-blue-600">{fmt(currentlySaving)}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gap to Goal</p>
                    <p className="mt-2 text-xl font-bold text-orange-600">{fmt(gapToGoal)}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm font-bold text-slate-900">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Status Message */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-blue-200">
                {percentage >= 100 ? (
                    <p className="text-sm text-green-700 font-medium">
                        ✓ Great job! You've exceeded your monthly savings goal.
                    </p>
                ) : percentage >= 75 ? (
                    <p className="text-sm text-blue-700 font-medium">
                        You're at {percentage.toFixed(0)}% of your monthly goal! Almost there.
                    </p>
                ) : percentage > 0 ? (
                    <p className="text-sm text-slate-700 font-medium">
                        You're at {percentage.toFixed(0)}% of your monthly goal. Keep saving!
                    </p>
                ) : (
                    <p className="text-sm text-slate-700 font-medium">
                        Start saving to reach your monthly goal of {fmt(monthlyGoal)}.
                    </p>
                )}
            </div>

            {/* CTA */}
            <Link
                href="/invest"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
            >
                Use this amount to invest →
            </Link>
        </section>
    );
}