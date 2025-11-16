"use client";

import { useState, useEffect } from "react";
import { FiVolume2, FiSquare, FiFileText } from "react-icons/fi";

export function TextToSpeech() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        setSelectedText(text);

        // Get the position of the selection
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 50, // Position above the selection
          });
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }
    };

    // Listen for text selection
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    // Check if speech is ongoing
    const checkSpeaking = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 100);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      clearInterval(checkSpeaking);
    };
  }, []);

  const normalizeTextForSpeech = (text: string): string => {
    let normalized = text;

    // Handle score patterns like "7.2/10" -> "7.2 out of 10"
    normalized = normalized.replace(/(\d+\.?\d*)\s*\/\s*(\d+)/g, "$1 out of $2");

    // Handle percentage ranges like "4-6%" -> "4 to 6 percent"
    normalized = normalized.replace(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*%/g, "$1 to $2 percent");

    // Handle dates to prevent misinterpretation
    // Don't let single numbers with slashes be interpreted as dates
    normalized = normalized.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g, "$1 slash $2 slash $3");

    return normalized;
  };

  const handleSpeak = () => {
    if (!selectedText) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Normalize text for better speech
    const textToSpeak = normalizeTextForSpeech(selectedText);

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Speak
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    // Hide button after starting
    setIsVisible(false);
  };

  const handleReadPage = () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    let pageText = "";

    // Helper function to get text from an element, excluding navigation
    const getTextFromElement = (element: Element): string => {
      let text = "";

      // Create a clone to avoid modifying the original
      const clone = element.cloneNode(true) as Element;

      // Remove all nav elements from the clone
      const navElements = clone.querySelectorAll("nav");
      navElements.forEach((nav) => nav.remove());

      // Get the text content
      text = clone.textContent || "";

      return text.trim();
    };

    // First, read header content
    const header = document.querySelector("header");
    if (header) {
      const headerText = getTextFromElement(header);
      if (headerText) {
        pageText += headerText + ". ";
      }
    }

    // Then, read main content
    const mainContent = document.querySelector("main");
    if (mainContent) {
      const mainText = getTextFromElement(mainContent);
      if (mainText) {
        pageText += mainText + ". ";
      }
    }

    // Clean up the text
    // Replace multiple spaces/newlines with single space
    pageText = pageText.replace(/\s+/g, " ");

    // Remove duplicate consecutive sentences
    const sentences = pageText.split(". ").map(s => s.trim()).filter(s => s.length > 0);
    const uniqueSentences: string[] = [];
    sentences.forEach((sentence) => {
      if (uniqueSentences.length === 0 || uniqueSentences[uniqueSentences.length - 1] !== sentence) {
        uniqueSentences.push(sentence);
      }
    });
    pageText = uniqueSentences.join(". ");

    // Normalize text for better speech
    const textToSpeak = normalizeTextForSpeech(pageText);

    // Wait for voices to load before speaking
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Get available voices and select the best one
      const voices = window.speechSynthesis.getVoices();

      // Prefer high-quality English voices
      const preferredVoice = voices.find(
        (voice) => voice.lang.startsWith("en") && (voice.name.includes("Google") || voice.name.includes("Enhanced") || voice.localService === false)
      ) || voices.find((voice) => voice.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = "en-US";

      // Speak
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    };

    // Check if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
      };
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Persistent "Read Page" button - always visible when visually impaired mode is on */}
      {!isSpeaking && (
        <button
          onClick={handleReadPage}
          className="fixed bottom-8 left-8 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          <FiFileText className="h-5 w-5" />
          Read Page Aloud
        </button>
      )}

      {/* Floating "Speak" button for selected text */}
      {isVisible && !isSpeaking && (
        <button
          onClick={handleSpeak}
          className="fixed z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <FiVolume2 className="h-4 w-4" />
          Read Aloud
        </button>
      )}

      {/* Stop button when speaking */}
      {isSpeaking && (
        <button
          onClick={handleStop}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
        >
          <FiSquare className="h-4 w-4" />
          Stop Reading
        </button>
      )}
    </>
  );
}
