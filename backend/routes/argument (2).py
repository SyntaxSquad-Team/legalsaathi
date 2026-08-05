from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Document, ArgumentDraft
from models import ArgumentDraftRequest, ArgumentDraftResponse
from ai.gemini_client import generate_answer

router = APIRouter()


def _build_argument_prompt(extracted_text: str, stance: str, key_points: str) -> str:
    truncated = extracted_text[:20000]
    key_points_block = f"\nThe litigant also wants these points emphasised:\n{key_points}\n" if key_points else ""
    return f"""You are LegalSaathi, an AI legal assistant for Indian litigants.

Draft a structured, plain-language set of legal arguments to be made in court, written from the
perspective of: {stance}.

Rules:
1. Base every argument strictly on facts present in the document below. Do not invent facts, sections, or precedents.
2. Structure the draft with numbered points, each with a one-line heading and a short explanation.
3. Where a document fact supports the argument, reference it briefly (e.g. "As per the hearing order dated...").
4. End with a short closing line summarising the relief/outcome being sought.
5. This is a first-draft aid for the litigant/advocate to refine — do not claim it is final or certified legal advice.
{key_points_block}
DOCUMENT:
{truncated}

DRAFT ARGUMENTS:"""


@router.post("/argument-draft", response_model=ArgumentDraftResponse)
def draft_argument(payload: ArgumentDraftRequest, db: Session = Depends(get_db)):
    """Generate a first-draft set of legal arguments from the document, grounded
    only in facts present in it. Saved to argument history for the document."""
    doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if doc.status != "ready":
        raise HTTPException(status_code=400, detail="Document is still processing.")

    try:
        prompt = _build_argument_prompt(doc.extracted_text, payload.stance, payload.key_points or "")
        draft_text = generate_answer("", prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Argument drafting failed: {str(e)}")

    draft = ArgumentDraft(doc_id=payload.doc_id, stance=payload.stance, draft_text=draft_text)
    db.add(draft)
    db.commit()
    db.refresh(draft)

    return ArgumentDraftResponse(
        success=True,
        draft_id=draft.id,
        draft_text=draft_text,
        message="Draft generated. Review with a qualified advocate before use — this is a starting point, not legal advice.",
    )


@router.get("/argument-draft/{doc_id}")
def list_drafts(doc_id: str, db: Session = Depends(get_db)):
    """List previously generated argument drafts for a document."""
    drafts = db.query(ArgumentDraft).filter(ArgumentDraft.doc_id == doc_id).order_by(ArgumentDraft.created_at.desc()).all()
    return [
        {"id": d.id, "stance": d.stance, "draft_text": d.draft_text, "created_at": d.created_at.strftime("%Y-%m-%d %H:%M")}
        for d in drafts
    ]
