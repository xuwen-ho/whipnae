"use client";

import { FiCheck } from "react-icons/fi";

type OnboardingModalProps = {
  usesLargeText: boolean;
  onEnableAccessibility: () => void;
  onSkip: () => void;
};

export function OnboardingModal({
  usesLargeText,
  onEnableAccessibility,
  onSkip,
}: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Warm gradient header with hand-drawn style illustration */}
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-6 pb-4 pt-6">
          {/* Decorative shapes - organic, hand-drawn feel */}
          <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-amber-200/40" />
          <div className="absolute right-8 top-8 h-8 w-8 rounded-full bg-rose-200/50" />
          <div className="absolute left-6 top-6 h-6 w-6 rotate-12 rounded-lg bg-orange-200/40" />
          
          {/* Logo and Welcome side by side */}
          <div className="relative flex items-center gap-4">
            {/* WeBank logo */}
            <div className="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-4 ring-white/50">
              <img 
                src="/images/webank-logo.png" 
                alt="WeBank" 
                className="h-16 w-16 object-contain"
              />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Welcome!
            </h2>
          </div>
        </div>

        {/* Main content */}
        <div className="px-6 py-5">
          {/* Detection message with friendly tone */}
          <div className="mb-5 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4">
            {usesLargeText ? (
              <p className="text-lg leading-relaxed text-slate-700">
                <span className="mr-1">👋</span>
                <strong className="text-amber-700">Hey there!</strong> We noticed you prefer larger text. 
                Want us to turn on easy-read mode?
              </p>
            ) : (
              <p className="text-lg leading-relaxed text-slate-700">
                <span className="mr-1">✨</span>
                We have <strong className="text-amber-700">accessibility features</strong> that make 
                reading easier — bigger text, clearer buttons, simpler layouts.
              </p>
            )}
          </div>

          {/* Action buttons - stacked for clarity */}
          <div className="space-y-3">
            <button
              onClick={onEnableAccessibility}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c3d8f] px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#15306f] hover:shadow-xl active:scale-[0.98]"
            >
              <FiCheck className="h-5 w-5" />
              Yes, enable easy mode
            </button>
            <button
              onClick={onSkip}
              className="w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              Not right now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

