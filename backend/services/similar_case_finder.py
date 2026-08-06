"""
Similar-case finder.

Real implementation would query eCourts / a case-law database and rank by
embedding similarity. For the hackathon demo we detect the likely case type
from keywords in the document and return realistic mock precedents, ranked
by a similarity score. Swap `_mock_bank` for a real API/vector search later —
the route/service boundary is already in place for that.
"""
import random

CASE_TYPE_KEYWORDS = {
    "criminal": ["fir", "accused", "chargesheet", "ipc", "bail", "arrest"],
    "family":   ["divorce", "custody", "maintenance", "alimony", "marriage"],
    "civil":    ["contract", "breach", "damages", "property", "possession"],
    "property": ["eviction", "tenant", "landlord", "possession", "encroachment"],
}

_mock_bank = {
    "criminal": [
        ("State vs. Sharma", "Criminal", "Bail granted with conditions", "Sessions Court, Delhi"),
        ("State vs. Iyer", "Criminal", "Chargesheet quashed on technical grounds", "High Court, Chennai"),
        ("State vs. Verma", "Criminal", "Convicted, sentence reduced on appeal", "Sessions Court, Pune"),
    ],
    "family": [
        ("Rao vs. Rao", "Family", "Mutual consent divorce granted", "Family Court, Bengaluru"),
        ("Nair vs. Nair", "Family", "Custody granted to mother with visitation", "Family Court, Kochi"),
        ("Gupta vs. Gupta", "Family", "Maintenance amount enhanced on appeal", "Family Court, Delhi"),
    ],
    "civil": [
        ("Mehta vs. Constructions Ltd", "Civil", "Damages awarded for breach of contract", "District Court, Mumbai"),
        ("Singh vs. Traders Co.", "Civil", "Settled via mediation before trial", "District Court, Jaipur"),
        ("Patel Enterprises vs. Kumar", "Civil", "Specific performance decreed", "District Court, Ahmedabad"),
    ],
    "property": [
        ("Reddy vs. Tenant Association", "Property", "Eviction order upheld", "District Court, Hyderabad"),
        ("Joshi vs. Landlord", "Property", "Eviction stayed pending appeal", "District Court, Nagpur"),
        ("Kumar vs. Municipal Corp", "Property", "Encroachment removal ordered", "District Court, Lucknow"),
    ],
}


def detect_case_type(extracted_text: str) -> str:
    text_lower = extracted_text.lower()
    scores = {ct: sum(1 for kw in kws if kw in text_lower) for ct, kws in CASE_TYPE_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "civil"


def find_similar_cases(extracted_text: str, top_k: int = 5) -> list[dict]:
    case_type = detect_case_type(extracted_text)
    pool = _mock_bank.get(case_type, _mock_bank["civil"])

    results = []
    for title, ctype, outcome, court in pool:
        results.append({
            "case_title": title,
            "case_type": ctype,
            "similarity": random.randint(68, 94),
            "outcome": outcome,
            "court": court,
        })

    results.sort(key=lambda r: r["similarity"], reverse=True)
    return results[:top_k]
