from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import Deadline, Document

from backend.models import DeadlineCreate, DeadlineUpdate, DeadlineOut

router = APIRouter()


def _to_out(d: Deadline) -> DeadlineOut:
    days_remaining = (d.due_date - datetime.utcnow()).days
    return DeadlineOut(
        id=d.id,
        doc_id=d.doc_id,
        title=d.title,
        description=d.description or "",
        due_date=d.due_date.strftime("%Y-%m-%d"),
        status=d.status,
        days_remaining=days_remaining,
    )


@router.post("/deadlines", response_model=DeadlineOut)
def create_deadline(payload: DeadlineCreate, db: Session = Depends(get_db)):
    """Create a deadline alert for a document (e.g. filing deadline, appeal window)."""
    doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        due = datetime.strptime(payload.due_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="due_date must be in YYYY-MM-DD format.")

    deadline = Deadline(
        doc_id=payload.doc_id,
        title=payload.title,
        description=payload.description or "",
        due_date=due,
        status="pending",
    )
    db.add(deadline)
    db.commit()
    db.refresh(deadline)
    return _to_out(deadline)


@router.get("/deadlines/{doc_id}", response_model=list[DeadlineOut])
def list_deadlines(doc_id: str, db: Session = Depends(get_db)):
    """List all deadlines for a document, soonest first."""
    deadlines = (
        db.query(Deadline)
        .filter(Deadline.doc_id == doc_id)
        .order_by(Deadline.due_date.asc())
        .all()
    )
    return [_to_out(d) for d in deadlines]


@router.get("/deadlines/alerts/upcoming", response_model=list[DeadlineOut])
def upcoming_alerts(within_days: int = 7, db: Session = Depends(get_db)):
    """Return all pending deadlines due within `within_days` days (default 7) — used to power alert banners."""
    deadlines = db.query(Deadline).filter(Deadline.status == "pending").all()
    out = [_to_out(d) for d in deadlines]
    return [d for d in out if 0 <= d.days_remaining <= within_days]


@router.patch("/deadlines/{deadline_id}", response_model=DeadlineOut)
def update_deadline(deadline_id: int, payload: DeadlineUpdate, db: Session = Depends(get_db)):
    """Mark a deadline as done / missed / pending."""
    deadline = db.query(Deadline).filter(Deadline.id == deadline_id).first()
    if not deadline:
        raise HTTPException(status_code=404, detail="Deadline not found.")
    deadline.status = payload.status
    db.commit()
    db.refresh(deadline)
    return _to_out(deadline)


@router.delete("/deadlines/{deadline_id}")
def delete_deadline(deadline_id: int, db: Session = Depends(get_db)):
    deadline = db.query(Deadline).filter(Deadline.id == deadline_id).first()
    if not deadline:
        raise HTTPException(status_code=404, detail="Deadline not found.")
    db.delete(deadline)
    db.commit()
    return {"success": True, "message": "Deadline deleted."}
