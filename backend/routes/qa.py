from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Document, QAHistory
from models import AskRequest, AskResponse, SummaryRequest, SummaryResponse, Citation
from ai.pipeline import get_answer, get_summary
import json

router = APIRouter()


@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest, db: Session = Depends(get_db)):
    """
    Ask a question about an uploaded document.

    - Retrieves top-K relevant chunks from ChromaDB
    - Sends chunks + question to Gemini
    - Returns grounded answer with citations

    The model is instructed never to answer outside the document.
    """
    # Check document exists
    doc = db.query(Document).filter(Document.doc_id == request.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found. Please upload it first.")
    if doc.status != "ready":
        raise HTTPException(status_code=400, detail="Document is still being processed. Try again shortly.")

    try:
        result = get_answer(request.doc_id, request.question)

        citations = [
            Citation(
                chunk_index=c["chunk_index"],
                source_text=c["source_text"]
            )
            for c in result["citations"]
        ]

        # Save Q&A to history
        history = QAHistory(
            doc_id=request.doc_id,
            question=request.question,
            answer=result["answer"],
            citations=json.dumps(result["citations"])
        )
        db.add(history)
        db.commit()

        return AskResponse(
            success=True,
            answer=result["answer"],
            citations=citations,
            message="Answer generated from uploaded document."
        )

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Q&A failed: {str(e)}")


@router.post("/summary", response_model=SummaryResponse)
def get_case_summary(request: SummaryRequest, db: Session = Depends(get_db)):
    """
    Get or regenerate the plain-language summary for an uploaded document.
    """
    doc = db.query(Document).filter(Document.doc_id == request.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        summary = get_summary(doc.extracted_text, request.language)
        return SummaryResponse(
            success=True,
            summary=summary,
            doc_id=request.doc_id,
            message="Summary generated from uploaded document."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")
