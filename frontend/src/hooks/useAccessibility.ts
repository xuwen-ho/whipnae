import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
  simpleMode: boolean;
  visuallyImpairedMode: boolean;
  dyslexiaFriendlyFont: boolean;
}

const STORAGE_KEY = 'whipnae-accessibility-settings';

const defaultSettings: AccessibilitySettings = {
  simpleMode: false,
  visuallyImpairedMode: false,
  dyslexiaFriendlyFont: false,
};

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AccessibilitySettings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  return {
    isSimpleMode: settings.simpleMode,
    isVisuallyImpairedMode: settings.visuallyImpairedMode,
    isDyslexicFont: settings.dyslexiaFriendlyFont,
    isLoaded,
  };
}
