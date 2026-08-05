from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from database import get_db, ShareLink, Document, Case, CaseDocument
from models import ShareLinkCreate, ShareLinkOut
from config import FRONTEND_URL

router = APIRouter()


@router.post("/share", response_model=ShareLinkOut)
def create_share_link(payload: ShareLinkCreate, db: Session = Depends(get_db)):
    """Create a shareable read-only link for a document or a whole case
    (e.g. to send to a lawyer, family member, or the other party)."""
    if not payload.doc_id and not payload.case_id:
        raise HTTPException(status_code=400, detail="Provide doc_id or case_id.")

    if payload.doc_id and not db.query(Document).filter(Document.doc_id == payload.doc_id).first():
        raise HTTPException(status_code=404, detail="Document not found.")
    if payload.case_id and not db.query(Case).filter(Case.case_id == payload.case_id).first():
        raise HTTPException(status_code=404, detail="Case not found.")

    token = secrets.token_urlsafe(12)
    expires_at = None
    if payload.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=payload.expires_in_days)

    link = ShareLink(
        token=token,
        doc_id=payload.doc_id,
        case_id=payload.case_id,
        expires_at=expires_at,
    )
    db.add(link)
    db.commit()

    return ShareLinkOut(
        token=token,
        share_url=f"{FRONTEND_URL}/shared/{token}",
        doc_id=payload.doc_id,
        case_id=payload.case_id,
        expires_at=expires_at.strftime("%Y-%m-%d") if expires_at else None,
    )


@router.get("/share/{token}")
def view_shared(token: str, db: Session = Depends(get_db)):
    """Public read-only view of a shared document or case. No auth required —
    this is the endpoint the recipient of a shared link hits."""
    link = db.query(ShareLink).filter(ShareLink.token == token).first()
    if not link:
        raise HTTPException(status_code=404, detail="This link is invalid or has been removed.")
    if link.revoked:
        raise HTTPException(status_code=410, detail="This link has been revoked by the owner.")
    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="This link has expired.")

    link.view_count += 1
    db.commit()

    if link.doc_id:
        doc = db.query(Document).filter(Document.doc_id == link.doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document no longer exists.")
        return {
            "type": "document",
            "filename": doc.filename,
            "page_count": doc.page_count,
            "status": doc.status,
            "extracted_text": doc.extracted_text[:5000],  # read-only preview, truncated
            "view_count": link.view_count,
        }

    if link.case_id:
        docs = db.query(CaseDocument).filter(CaseDocument.case_id == link.case_id).all()
        doc_records = [
            db.query(Document).filter(Document.doc_id == d.doc_id).first() for d in docs
        ]
        return {
            "type": "case",
            "case_id": link.case_id,
            "documents": [
                {"doc_id": d.doc_id, "filename": d.filename, "status": d.status}
                for d in doc_records if d
            ],
            "view_count": link.view_count,
        }


@router.delete("/share/{token}")
def revoke_share_link(token: str, db: Session = Depends(get_db)):
    """Revoke a shared link so it can no longer be viewed."""
    link = db.query(ShareLink).filter(ShareLink.token == token).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found.")
    link.revoked = 1
    db.commit()
    return {"success": True, "message": "Link revoked."}
