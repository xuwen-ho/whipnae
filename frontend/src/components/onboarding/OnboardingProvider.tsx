"use client";

import { useState, useEffect } from "react";
import { OnboardingModal } from "./OnboardingModal";

const ONBOARDING_COMPLETED_KEY = "whipnae-onboarding-completed";
const ACCESSIBILITY_SETTINGS_KEY = "whipnae-accessibility-settings";

export function OnboardingProvider() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [usesLargeText, setUsesLargeText] = useState(false);

  useEffect(() => {
    // Check if onboarding has already been completed
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    if (hasCompletedOnboarding) {
      return;
    }

    // Detect if user has large text preference
    // Using CSS media query for font-size preference detection
    // This checks if the user has set their browser/OS to prefer larger text
    const prefersLargeText = window.matchMedia("(min-resolution: 120dpi)").matches;
    
    // Alternative: Check if user has reduced motion (often correlates with accessibility needs)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Check font size by creating a test element
    const testEl = document.createElement("div");
    testEl.style.cssText = "font-size: 1rem; position: absolute; visibility: hidden;";
    document.body.appendChild(testEl);
    const computedFontSize = parseFloat(window.getComputedStyle(testEl).fontSize);
    document.body.removeChild(testEl);
    
    // Default browser font is usually 16px, larger indicates user preference for big text
    const hasLargeFontSize = computedFontSize > 18;
    
    setUsesLargeText(prefersLargeText || prefersReducedMotion || hasLargeFontSize);
    setShowOnboarding(true);
  }, []);

  const handleEnableAccessibility = () => {
    // Enable both simpleMode and visuallyImpairedMode
    const newSettings = {
      simpleMode: true,
      visuallyImpairedMode: true,
      dyslexiaFriendlyFont: false,
    };

    // Save to localStorage
    localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(newSettings));

    // Apply CSS classes immediately
    document.body.classList.add("simple-mode");
    document.body.classList.add("visually-impaired-mode");

    // Dispatch event to notify other components (like AccessibilityProvider)
    window.dispatchEvent(new Event("accessibility-settings-changed"));

    // Mark onboarding as completed
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setShowOnboarding(false);
  };

  const handleSkip = () => {
    // Mark onboarding as completed without enabling accessibility
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setShowOnboarding(false);
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <OnboardingModal
      usesLargeText={usesLargeText}
      onEnableAccessibility={handleEnableAccessibility}
      onSkip={handleSkip}
    />
  );
}
