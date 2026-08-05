from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, Document, QAHistory
from models import HistoryItem

router = APIRouter()


@router.get("/history", response_model=list[HistoryItem])
def document_history(db: Session = Depends(get_db)):
    """List every document ever uploaded, most recent first, with Q&A activity count.
    Powers the 'Document History' page so users can revisit past uploads."""
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    out = []
    for d in docs:
        qa_count = db.query(QAHistory).filter(QAHistory.doc_id == d.doc_id).count()
        out.append(HistoryItem(
            doc_id=d.doc_id,
            filename=d.filename,
            page_count=d.page_count,
            status=d.status,
            created_at=d.created_at.strftime("%Y-%m-%d %H:%M"),
            qa_count=qa_count,
        ))
    return out


@router.get("/history/{doc_id}/qa")
def document_qa_history(doc_id: str, db: Session = Depends(get_db)):
    """Full Q&A conversation history for a specific document."""
    items = db.query(QAHistory).filter(QAHistory.doc_id == doc_id).order_by(QAHistory.created_at.asc()).all()
    return [
        {"question": i.question, "answer": i.answer, "created_at": i.created_at.strftime("%Y-%m-%d %H:%M")}
        for i in items
    ]
