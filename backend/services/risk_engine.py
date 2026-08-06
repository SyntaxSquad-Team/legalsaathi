"""
Heuristic + Gemini-assisted case risk scoring.

For the hackathon demo this combines simple keyword heuristics (fast, free,
always works) with an optional Gemini pass for a short rationale. Score is
0-100 where higher = more urgent / higher risk to the litigant.
"""
import re
from backend.ai.gemini_client import generate_answer

HIGH_RISK_TERMS = [
    "non-bailable", "custody", "arrest warrant", "ex-parte", "default judgment",
    "contempt", "attachment of property", "conviction", "death", "life imprisonment",
]
MEDIUM_RISK_TERMS = [
    "bailable", "summons", "notice", "show cause", "penalty", "fine", "eviction",
    "injunction", "stay order",
]


def compute_risk_score(extracted_text: str) -> dict:
    text_lower = extracted_text.lower()

    high_hits = [t for t in HIGH_RISK_TERMS if t in text_lower]
    medium_hits = [t for t in MEDIUM_RISK_TERMS if t in text_lower]

    score = 20 + len(high_hits) * 18 + len(medium_hits) * 8
    score = min(score, 97)

    # Missed/upcoming deadline language nudges risk up
    if re.search(r"\bwithin\s+\d+\s+days\b", text_lower):
        score = min(score + 10, 98)

    if score >= 65:
        level = "High"
    elif score >= 35:
        level = "Medium"
    else:
        level = "Low"

    factors = []
    if high_hits:
        factors.append(f"Document mentions high-severity terms: {', '.join(high_hits[:4])}")
    if medium_hits:
        factors.append(f"Document mentions procedural risk terms: {', '.join(medium_hits[:4])}")
    if re.search(r"\bwithin\s+\d+\s+days\b", text_lower):
        factors.append("A time-bound deadline is mentioned in the document")
    if not factors:
        factors.append("No high-risk legal terms detected — routine case language")

    return {"risk_score": score, "risk_level": level, "factors": factors}


def get_risk_explanation(extracted_text: str, risk_level: str) -> str:
    """Optional one-line Gemini explanation. Falls back silently if Gemini fails."""
    try:
        prompt = (
            f"In one short plain-language sentence, explain why a court document might be "
            f"rated '{risk_level}' risk for the litigant. Do not repeat the rating itself. "
            f"Base it only on this document text:\n\n{extracted_text[:4000]}"
        )
        return generate_answer("", prompt).strip()
    except Exception:
        return ""
