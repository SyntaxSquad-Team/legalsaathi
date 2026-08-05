from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db, Hearing, Document
from models import HearingCreate, HearingUpdate, HearingOut

router = APIRouter()


def _to_out(h: Hearing) -> HearingOut:
    return HearingOut(
        id=h.id,
        doc_id=h.doc_id,
        hearing_date=h.hearing_date.strftime("%Y-%m-%d"),
        court_name=h.court_name or "",
        purpose=h.purpose or "",
        outcome=h.outcome or "",
        status=h.status,
    )


@router.post("/hearings", response_model=HearingOut)
def add_hearing(payload: HearingCreate, db: Session = Depends(get_db)):
    """Add a hearing date to the tracker for a case/document."""
    doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        hdate = datetime.strptime(payload.hearing_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="hearing_date must be in YYYY-MM-DD format.")

    status = "completed" if hdate < datetime.utcnow() else "upcoming"

    hearing = Hearing(
        doc_id=payload.doc_id,
        hearing_date=hdate,
        court_name=payload.court_name or "",
        purpose=payload.purpose or "",
        status=status,
    )
    db.add(hearing)
    db.commit()
    db.refresh(hearing)
    return _to_out(hearing)


@router.get("/hearings/{doc_id}", response_model=list[HearingOut])
def list_hearings(doc_id: str, db: Session = Depends(get_db)):
    """List all hearings for a document, chronological."""
    hearings = (
        db.query(Hearing)
        .filter(Hearing.doc_id == doc_id)
        .order_by(Hearing.hearing_date.asc())
        .all()
    )
    return [_to_out(h) for h in hearings]


@router.patch("/hearings/{hearing_id}", response_model=HearingOut)
def update_hearing(hearing_id: int, payload: HearingUpdate, db: Session = Depends(get_db)):
    """Update hearing status/outcome after it happens (e.g. adjourned, next date set)."""
    hearing = db.query(Hearing).filter(Hearing.id == hearing_id).first()
    if not hearing:
        raise HTTPException(status_code=404, detail="Hearing not found.")
    if payload.status is not None:
        hearing.status = payload.status
    if payload.outcome is not None:
        hearing.outcome = payload.outcome
    db.commit()
    db.refresh(hearing)
    return _to_out(hearing)


@router.delete("/hearings/{hearing_id}")
def delete_hearing(hearing_id: int, db: Session = Depends(get_db)):
    hearing = db.query(Hearing).filter(Hearing.id == hearing_id).first()
    if not hearing:
        raise HTTPException(status_code=404, detail="Hearing not found.")
    db.delete(hearing)
    db.commit()
    return {"success": True, "message": "Hearing deleted."}
