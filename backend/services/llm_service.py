from __future__ import annotations

import os
from typing import Optional

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class LLMService:
    """Async wrapper around Google Gemini API."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        self.api_key_configured = bool(self.api_key)

    async def generate_response(self, prompt: str, model: str = "gemini-2.0-flash-lite") -> str:
        """
        Generate a response from Google Gemini.

        Args:
            prompt: The user prompt to send to the LLM
            model: The Gemini model to use (default: gemini-2.0-flash-lite)

        Returns:
            The generated response text

        Raises:
            ValueError: If no API key is configured
        """
        if not self.api_key_configured:
            raise ValueError(
                "Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            )

        try:
            # Create model with safety settings for each request
            model_instance = genai.GenerativeModel(
                model,
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )

            # Add system context to the prompt
            full_prompt = f"""You are a helpful financial advisor assistant providing personalized, actionable advice.

{prompt}"""

            print(f"[DEBUG] Sending prompt to Gemini (length: {len(full_prompt)} chars)", flush=True)

            response = await model_instance.generate_content_async(
                full_prompt,
                generation_config={
                    'temperature': 0.7,
                    'max_output_tokens': 500,
                }
            )

            print(f"[DEBUG] Response received. Candidates: {len(response.candidates) if response.candidates else 0}", flush=True)

            # Check if response was blocked or empty
            if not response.candidates:
                raise RuntimeError("Response was blocked by safety filters or empty")

            candidate = response.candidates[0]
            print(f"[DEBUG] Finish reason: {candidate.finish_reason}", flush=True)
            print(f"[DEBUG] Safety ratings: {candidate.safety_ratings}", flush=True)

            # Get the text from the first candidate
            if candidate.content and candidate.content.parts:
                return candidate.content.parts[0].text or ""
            else:
                # Provide detailed error message
                safety_info = "\n".join([f"  - {rating.category}: {rating.probability}" for rating in candidate.safety_ratings]) if candidate.safety_ratings else "No safety ratings"
                raise RuntimeError(f"No content in response. Finish reason: {candidate.finish_reason}\nSafety ratings:\n{safety_info}")

        except Exception as e:
            # Log error and raise with context
            raise RuntimeError(f"Failed to generate LLM response: {str(e)}") from e
