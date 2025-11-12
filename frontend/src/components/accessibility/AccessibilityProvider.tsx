"use client";

import { useEffect, useState } from "react";
import { TextToSpeech } from "./TextToSpeech";

export function AccessibilityProvider() {
  const [isVisuallyImpairedMode, setIsVisuallyImpairedMode] = useState(false);

  useEffect(() => {
    // Load accessibility settings from localStorage
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("whipnae-accessibility-settings");
        if (saved) {
          const settings = JSON.parse(saved);
          setIsVisuallyImpairedMode(settings.visuallyImpairedMode || false);
        }
      } catch (error) {
        console.error("Failed to load accessibility settings:", error);
      }
    };

    // Initial load
    loadSettings();

    // Listen for storage changes (when settings are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "whipnae-accessibility-settings") {
        loadSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event when settings change on same page
    const handleSettingsChange = () => {
      // Defer the state update to avoid updating during render
      setTimeout(() => {
        loadSettings();
      }, 0);
    };

    window.addEventListener("accessibility-settings-changed", handleSettingsChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("accessibility-settings-changed", handleSettingsChange);
    };
  }, []);

  return (
    <>
      {isVisuallyImpairedMode && <TextToSpeech />}
    </>
  );
}
