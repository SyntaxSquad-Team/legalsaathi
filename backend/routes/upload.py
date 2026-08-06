from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Document

from backend.models import UploadResponse
from backend.services.file_store import save_uploaded_file

from backend.services.ocr import extract_text_from_pdf

from backend.ai.pipeline import process_document, get_summary


import traceback

router = APIRouter()

ALLOWED_TYPES = {"application/pdf", "image/png", "image/jpeg"}
MAX_FILE_SIZE_MB = 50


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a court document (PDF or scanned image).

    Steps:
    1. Validate file type and size
    2. Save file to disk
    3. Run OCR to extract text
    4. Generate plain-language summary
    5. Chunk and embed text into ChromaDB
    6. Save document metadata to SQLite
    7. Return doc_id for use in Q&A and timeline endpoints
    """

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Upload a PDF or image."
        )

    try:
        # Save to disk
        doc_id, file_path = await save_uploaded_file(file)

        # OCR: extract text
        extracted_text, page_count = extract_text_from_pdf(file_path)

        if not extracted_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract any text from this document. Try a clearer scan."
            )

        # Generate summary using Gemini
        summary = get_summary(extracted_text)

        # Chunk + embed + store in ChromaDB
        chunk_count = process_document(doc_id, extracted_text)

        # Save metadata to SQLite
        doc_record = Document(
            doc_id=doc_id,
            filename=file.filename,
            file_path=file_path,
            page_count=page_count,
            extracted_text=extracted_text,
            extracted_text_len=len(extracted_text),
            status="ready"
        )
        db.add(doc_record)
        db.commit()

        return UploadResponse(
            success=True,
            doc_id=doc_id,
            filename=file.filename,
            page_count=page_count,
            message=f"Document processed successfully. {chunk_count} chunks indexed. Summary generated."
        )

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
