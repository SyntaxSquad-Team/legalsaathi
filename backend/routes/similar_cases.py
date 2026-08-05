from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Document
from models import SimilarCaseRequest, SimilarCaseResponse, SimilarCaseItem
from services.similar_case_finder import find_similar_cases

router = APIRouter()


@router.post("/similar-cases", response_model=SimilarCaseResponse)
def get_similar_cases(payload: SimilarCaseRequest, db: Session = Depends(get_db)):
    """Find similar past cases based on the uploaded document's content and
    likely case type, to give the litigant a sense of precedent and outcomes."""
    doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    results = find_similar_cases(doc.extracted_text, payload.top_k or 5)

    return SimilarCaseResponse(
        success=True,
        doc_id=payload.doc_id,
        similar_cases=[SimilarCaseItem(**r) for r in results],
        message="Similar cases found based on detected case type. For demo purposes; connect a case-law API for production use.",
    )
