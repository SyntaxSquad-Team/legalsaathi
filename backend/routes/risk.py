from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Document
from models import RiskScoreRequest, RiskScoreResponse
from services.risk_engine import compute_risk_score

router = APIRouter()


@router.post("/risk-score", response_model=RiskScoreResponse)
def get_risk_score(payload: RiskScoreRequest, db: Session = Depends(get_db)):
    """Compute a case risk score (0-100) from the uploaded document's content,
    flagging high-severity legal terms and time-bound deadlines."""
    doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if doc.status != "ready":
        raise HTTPException(status_code=400, detail="Document is still processing.")

    result = compute_risk_score(doc.extracted_text)

    return RiskScoreResponse(
        success=True,
        doc_id=payload.doc_id,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        factors=result["factors"],
        message="Risk score computed from document content. This is a guide, not legal advice.",
    )
