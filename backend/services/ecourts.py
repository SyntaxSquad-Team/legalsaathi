import httpx
import random
from datetime import datetime, timedelta
from backend.config import ECOURTS_API_KEY


# ── eCourts API integration ───────────────────────────────────────────────────
# Real endpoint: https://services.ecourts.gov.in/ecourtindia_v6/
# API key required. Register at: https://developer.ecourts.gov.in/
# For hackathon demo, fallback mock data is used if API is unavailable.

ECOURTS_BASE_URL = "https://services.ecourts.gov.in/ecourtindia_v6/"


async def get_similar_cases(case_type: str, court_name: str) -> list[dict]:
    """
    Fetch similar resolved cases from eCourts API.
    Falls back to mock data if API key is not set or request fails.
    """
    if not ECOURTS_API_KEY:
        return _mock_similar_cases(case_type)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{ECOURTS_BASE_URL}cases",
                params={
                    "case_type": case_type,
                    "court": court_name,
                    "status": "disposed",
                    "limit": 20,
                },
                headers={"Authorization": f"Bearer {ECOURTS_API_KEY}"}
            )
            if response.status_code == 200:
                return response.json().get("cases", [])
            else:
                return _mock_similar_cases(case_type)
    except Exception:
        return _mock_similar_cases(case_type)


def predict_timeline(similar_cases: list[dict], case_type: str) -> dict:
    """
    Given a list of similar resolved cases, predict:
    - Next hearing date
    - Estimated total duration in months
    - Confidence level
    """
    if not similar_cases:
        return _fallback_prediction(case_type)

    # Calculate average duration from similar cases
    durations = []
    for case in similar_cases:
        if "duration_months" in case:
            durations.append(case["duration_months"])

    if not durations:
        return _fallback_prediction(case_type)

    avg_duration = sum(durations) / len(durations)
    confidence = (
        "high"   if len(durations) >= 10 else
        "medium" if len(durations) >= 5  else
        "low"
    )

    # Predict next hearing ~3 to 6 weeks from today
    days_to_next = random.randint(21, 45)
    next_hearing = datetime.now() + timedelta(days=days_to_next)

    return {
        "predicted_next_hearing": next_hearing.strftime("%d %B %Y"),
        "estimated_duration_months": round(avg_duration),
        "confidence": confidence,
        "based_on_cases": len(durations),
    }


# ── Mock data for demo / when API key not set ─────────────────────────────────

def _mock_similar_cases(case_type: str) -> list[dict]:
    """Returns realistic mock cases for demo purposes."""
    base_durations = {
        "civil":    [18, 24, 30, 22, 28, 36, 20, 26],
        "criminal": [12, 18, 24, 15, 20, 30, 14, 22],
        "family":   [10, 14, 18, 12, 16, 20, 11, 15],
    }
    durations = base_durations.get(
        case_type.lower() if case_type else "civil",
        [18, 24, 30, 22]
    )
    return [{"duration_months": d} for d in durations]


def _fallback_prediction(case_type: str) -> dict:
    defaults = {
        "civil":    (24, "6 February 2025"),
        "criminal": (18, "14 January 2025"),
        "family":   (14, "28 January 2025"),
    }
    duration, next_date = defaults.get(
        case_type.lower() if case_type else "civil",
        (20, "10 February 2025")
    )
    return {
        "predicted_next_hearing": next_date,
        "estimated_duration_months": duration,
        "confidence": "low",
        "based_on_cases": 0,
    }
