from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid
from database import get_db, Case, CaseDocument, Document
from models import CaseCreate, CaseOut

router = APIRouter()


def _to_out(db: Session, case: Case) -> CaseOut:
    links = db.query(CaseDocument).filter(CaseDocument.case_id == case.case_id).all()
    return CaseOut(
        case_id=case.case_id,
        title=case.title,
        description=case.description or "",
        doc_ids=[l.doc_id for l in links],
    )


@router.post("/cases", response_model=CaseOut)
def create_case(payload: CaseCreate, db: Session = Depends(get_db)):
    """Create a case that links multiple related documents together
    (e.g. FIR + chargesheet + bail order for the same matter)."""
    case_id = str(uuid.uuid4())[:8]
    case = Case(case_id=case_id, title=payload.title, description=payload.description or "")
    db.add(case)

    for doc_id in payload.doc_ids:
        doc = db.query(Document).filter(Document.doc_id == doc_id).first()
        if doc:
            db.add(CaseDocument(case_id=case_id, doc_id=doc_id))

    db.commit()
    db.refresh(case)
    return _to_out(db, case)


@router.get("/cases", response_model=list[CaseOut])
def list_cases(db: Session = Depends(get_db)):
    cases = db.query(Case).order_by(Case.created_at.desc()).all()
    return [_to_out(db, c) for c in cases]


@router.get("/cases/{case_id}", response_model=CaseOut)
def get_case(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")
    return _to_out(db, case)


@router.post("/cases/{case_id}/documents/{doc_id}", response_model=CaseOut)
def link_document(case_id: str, doc_id: str, db: Session = Depends(get_db)):
    """Link an additional document into an existing case."""
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")
    doc = db.query(Document).filter(Document.doc_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    existing = db.query(CaseDocument).filter(
        CaseDocument.case_id == case_id, CaseDocument.doc_id == doc_id
    ).first()
    if not existing:
        db.add(CaseDocument(case_id=case_id, doc_id=doc_id))
        db.commit()

    db.refresh(case)
    return _to_out(db, case)


@router.delete("/cases/{case_id}/documents/{doc_id}", response_model=CaseOut)
def unlink_document(case_id: str, doc_id: str, db: Session = Depends(get_db)):
    """Remove a document from a case."""
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    link = db.query(CaseDocument).filter(
        CaseDocument.case_id == case_id, CaseDocument.doc_id == doc_id
    ).first()
    if link:
        db.delete(link)
        db.commit()

    return _to_out(db, case)
