"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";

import { BottomNav } from "@/components/layout/BottomNav";
import { FinancialProfileCard } from "@/components/profile/FinancialProfileCard";
import { RecommendationsQuizCard } from "@/components/profile/RecommendationsQuizCard";
import { SettingsToggleItem } from "@/components/profile/SettingsToggleItem";

type AccessibilitySetting =
  | "simpleMode"
  | "visuallyImpairedMode"
  | "dyslexiaFriendlyFont";

const profileNavItems = [
  { id: "home", link: "/", label: "Home", icon: FiHome },
  { id: "Chat", link: "/chat", label: "Chat", icon: FiMessageCircle },
  { id: "profile", link: "/profile", label: "Profile", icon: FiUser, isActive: true },
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [accessibilitySettings, setAccessibilitySettings] = useState<Record<AccessibilitySetting, boolean>>({
    simpleMode: true,
    visuallyImpairedMode: true,
    dyslexiaFriendlyFont: true,
  });

  const handleToggle = (setting: AccessibilitySetting) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleStartQuiz = () => {
    router.push('/profile/quiz');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-0 bg-[#1c3d8f] text-white shadow-lg">
        <div className="mx-auto w-full max-w-3xl px-6">
          <div className="mt-4">
            <RecommendationsQuizCard onStart={handleStartQuiz} />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 bg-slate-100">
        <div className="mx-auto w-full max-w-3xl px-6 pb-20">
          <div className="space-y-8 pt-10">
            <section>
              <h2 className="text-base font-semibold text-slate-900">AI Personalization</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review how your financial assistant adapts recommendations to your profile.
              </p>
              <div className="mt-4">
                <FinancialProfileCard
                  profileName="Balanced Planner"
                  profileSummary="Prioritizes steady growth, conservative risk, and consistent savings progress."
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">Accessibility Settings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tailor readability and navigation to suit your preferences.
              </p>
              <div className="mt-4 space-y-4">
                <SettingsToggleItem
                  label="Simple Mode (Elderly)"
                  description="Simplified interface for elderly users"
                  isOn={accessibilitySettings.simpleMode}
                  onToggle={() => handleToggle("simpleMode")}
                />
                <SettingsToggleItem
                  label="Visually Impaired Mode"
                  description="Larger text, high contrast, and voice-over"
                  isOn={accessibilitySettings.visuallyImpairedMode}
                  onToggle={() => handleToggle("visuallyImpairedMode")}
                />
                <SettingsToggleItem
                  label="Dyslexia-Friendly Font"
                  description="Optimized font for readability"
                  isOn={accessibilitySettings.dyslexiaFriendlyFont}
                  onToggle={() => handleToggle("dyslexiaFriendlyFont")}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav items={profileNavItems} />
    </div>
  );
}
