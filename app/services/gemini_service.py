"""
Gemini API service using direct REST call.
"""

import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Use gemini-2.0-flash (gemini-1.5-flash deprecated Apr 2025)
MODEL_NAME = "gemini-2.5-flash"


def summarize_text(text: str) -> str:
    if not text:
        return ""

    url = f"https://generativelanguage.googleapis.com/v1/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            "You are summarizing a research paper abstract. "
                            "Return a concise bullet-point summary as plain text.\n"
                            "Rules:\n"
                            "- Output 5 bullets (no more, no less).\n"
                            "- Each bullet must be one sentence and start with '- '.\n"
                            "- No title, no preface, no numbering, no extra commentary.\n\n"
                            f"Abstract:\n{text}"
                        )
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()

        data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"].strip()

    except Exception as e:
        print("Gemini REST error:", e)
        return "Summary could not be generated."