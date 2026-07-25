from pydantic import BaseModel
from typing import Optional


#  Upload 
class UploadResponse(BaseModel):
    success: bool
    doc_id: str
    filename: str
    page_count: int
    message: str


#  Q&A

class AskRequest(BaseModel):
    doc_id: str
    question: str


class Citation(BaseModel):
    chunk_index: int
    source_text: str   


class AskResponse(BaseModel):
    success: bool
    answer: str
    citations: list[Citation]
    message: str


#  Summary

class SummaryRequest(BaseModel):
    doc_id: str
    language: str="English"


class SummaryResponse(BaseModel):
    success: bool
    summary: str
    doc_id: str
    message: str


#  Timeline

class TimelineRequest(BaseModel):
    doc_id: str
    case_type: Optional[str] = None    # e.g. "civil", "criminal"
    court_name: Optional[str] = None


class TimelineResponse(BaseModel):
    success: bool
    predicted_next_hearing: str
    estimated_duration_months: int
    confidence: str                    
    based_on_cases: int               
    message: str


#  Document metadata (stored in DB)

class DocumentMeta(BaseModel):
    doc_id: str
    filename: str
    file_path: str
    page_count: int
    extracted_text_length: int
    status: str                        # "processing", "ready", "failed"
