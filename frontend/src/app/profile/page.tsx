"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";

import { BottomNav } from "@/components/layout/BottomNav";
import { FinancialProfileCard } from "@/components/profile/FinancialProfileCard";
import { RecommendationsQuizCard } from "@/components/profile/RecommendationsQuizCard";
import { SettingsToggleItem } from "@/components/profile/SettingsToggleItem";
import { RemoteConnectionSection } from "@/components/remote";
import type { FinancialProfile } from "@/lib/quiz/types";

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
    simpleMode: false,
    visuallyImpairedMode: false,
    dyslexiaFriendlyFont: false,
  });

  const [userProfile, setUserProfile] = useState<FinancialProfile | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [personalizationSummary, setPersonalizationSummary] = useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Load saved profile, insights, and accessibility settings from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('whipnae-user-profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as FinancialProfile;
        setUserProfile(profile);
        // Don't auto-generate insights on load to avoid quota issues
        // User can manually trigger with the regenerate button
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    }

    // Load saved insights if they exist
    const savedInsights = localStorage.getItem('whipnae-ai-insights');
    if (savedInsights) {
      try {
        const insightsData = JSON.parse(savedInsights);
        setAiInsights(insightsData.insights || []);
        setPersonalizationSummary(insightsData.personalizationSummary || '');
      } catch (error) {
        console.error('Failed to load insights:', error);
      }
    }

    // Load saved accessibility settings
    const savedSettings = localStorage.getItem('whipnae-accessibility-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAccessibilitySettings(settings);

        // Apply dyslexic font if enabled
        if (settings.dyslexiaFriendlyFont) {
          document.body.classList.add('dyslexic-font');
        }

        // Apply simple mode if enabled
        if (settings.simpleMode) {
          document.body.classList.add('simple-mode');
        }

        // Apply visually impaired mode if enabled
        if (settings.visuallyImpairedMode) {
          document.body.classList.add('visually-impaired-mode');
        }
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  const generateInsights = async (profile: FinancialProfile) => {
    setIsLoadingInsights(true);

    try {
      const response = await fetch('/api/profile/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: profile.userName,
          profileType: profile.profileType,
          profileName: profile.profileName,
          riskScore: profile.riskScore,
          profileSummary: profile.profileSummary,
          characteristics: profile.characteristics,
          recommendations: profile.recommendations,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setAiInsights(data.insights);
      setPersonalizationSummary(data.personalizationSummary);

      // Save insights to localStorage for persistence
      localStorage.setItem('whipnae-ai-insights', JSON.stringify({
        insights: data.insights,
        personalizationSummary: data.personalizationSummary,
      }));
    } catch (error) {
      console.error('Error generating insights:', error);
      // Show friendly error state
      setAiInsights([]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleRegenerateInsights = () => {
    if (userProfile) {
      generateInsights(userProfile);
    }
  };

  const handleToggle = (setting: AccessibilitySetting) => {
    setAccessibilitySettings((prev) => {
      const newSettings = {
        ...prev,
        [setting]: !prev[setting],
      };

      // Save to localStorage
      localStorage.setItem('whipnae-accessibility-settings', JSON.stringify(newSettings));

      // Apply dyslexic font immediately
      if (setting === 'dyslexiaFriendlyFont') {
        if (newSettings.dyslexiaFriendlyFont) {
          document.body.classList.add('dyslexic-font');
        } else {
          document.body.classList.remove('dyslexic-font');
        }
      }

      // Apply simple mode immediately
      if (setting === 'simpleMode') {
        if (newSettings.simpleMode) {
          document.body.classList.add('simple-mode');
        } else {
          document.body.classList.remove('simple-mode');
        }
      }

      // Apply visually impaired mode immediately
      if (setting === 'visuallyImpairedMode') {
        if (newSettings.visuallyImpairedMode) {
          document.body.classList.add('visually-impaired-mode');
        } else {
          document.body.classList.remove('visually-impaired-mode');
        }
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('accessibility-settings-changed'));

      return newSettings;
    });
  };

  const handleStartQuiz = () => {
    // Set flag to start from step 1
    sessionStorage.setItem('whipnae-quiz-restart', 'true');
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
                {userProfile ? (
                  <FinancialProfileCard
                    userName={userProfile.userName}
                    profileName={userProfile.profileName}
                    profileSummary={userProfile.profileSummary}
                    riskScore={userProfile.riskScore}
                    knowledgeLevel={userProfile.characteristics.knowledgeLevel}
                    aiInsights={aiInsights}
                    personalizationSummary={personalizationSummary}
                    isLoadingInsights={isLoadingInsights}
                    onRegenerateInsights={handleRegenerateInsights}
                  />
                ) : (
                  <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                    <p className="text-slate-600">No profile found. Take the quiz to get started!</p>
                    <button
                      onClick={handleStartQuiz}
                      className="mt-4 rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Take Quiz
                    </button>
                  </div>
                )}
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

            <section>
              <h2 className="text-base font-semibold text-slate-900">Remote Assistance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Get help from a trusted family member or friend to navigate the app.
              </p>
              <div className="mt-4">
                <RemoteConnectionSection />
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav items={profileNavItems} />
    </div>
  );
}
