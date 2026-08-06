from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from backend.database import get_db
from backend.models import Document
from backend.ai.pipeline import get_summary
from backend.services.pdf_export import build_summary_pdf

router = APIRouter()

EXPORT_DIR = "exports"
os.makedirs(EXPORT_DIR, exist_ok=True)


@router.get("/export/summary/{doc_id}")
def export_summary_pdf(doc_id: str, language: str = "English", db: Session = Depends(get_db)):
    """Generate and download the case summary as a PDF."""
    doc = db.query(Document).filter(Document.doc_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if doc.status != "ready":
        raise HTTPException(status_code=400, detail="Document is still processing.")

    try:
        summary = get_summary(doc.extracted_text, language)
        output_path = os.path.join(EXPORT_DIR, f"{doc_id}_summary.pdf")
        build_summary_pdf(doc.filename, summary, language, output_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename=f"{doc.filename.rsplit('.', 1)[0]}_summary.pdf",
    )
