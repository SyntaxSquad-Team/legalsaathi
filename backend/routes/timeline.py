from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Document

from backend.models import TimelineRequest, TimelineResponse
from backend.services.ecourts import get_similar_cases, predict_timeline

router = APIRouter()


@router.post("/timeline", response_model=TimelineResponse)
async def get_timeline(request: TimelineRequest, db: Session = Depends(get_db)):
    """
    Predict timeline for a case based on eCourts data.

    If eCourts API key is not set, falls back to mock data
    so the demo always works.
    """
    doc = db.query(Document).filter(Document.doc_id == request.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        # Fetch similar resolved cases from eCourts
        similar_cases = await get_similar_cases(
            case_type=request.case_type or "civil",
            court_name=request.court_name or "District Court"
        )

        # Predict based on historical data
        prediction = predict_timeline(similar_cases, request.case_type or "civil")

        return TimelineResponse(
            success=True,
            predicted_next_hearing=prediction["predicted_next_hearing"],
            estimated_duration_months=prediction["estimated_duration_months"],
            confidence=prediction["confidence"],
            based_on_cases=prediction["based_on_cases"],
            message="Timeline predicted based on similar resolved cases."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timeline prediction failed: {str(e)}")
