# -------------------------------
# Pydantic Schemas (API layer)
# -------------------------------
from pydantic import BaseModel
from typing import Optional
from database import init_db
from database import Base

# Upload
class UploadResponse(BaseModel):
    success: bool
    doc_id: str
    filename: str
    page_count: int
    message: str

# Q&A
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

# Summary
class SummaryRequest(BaseModel):
    doc_id: str
    language: str = "English"

class SummaryResponse(BaseModel):
    success: bool
    summary: str
    doc_id: str
    message: str

# Timeline
class TimelineRequest(BaseModel):
    doc_id: str
    case_type: Optional[str] = None
    court_name: Optional[str] = None

class TimelineResponse(BaseModel):
    success: bool
    predicted_next_hearing: str
    estimated_duration_months: int
    confidence: str
    based_on_cases: int
    message: str

# Document metadata
class DocumentMeta(BaseModel):
    doc_id: str
    filename: str
    file_path: str
    page_count: int
    extracted_text_length: int
    status: str

# Deadlines
class DeadlineCreate(BaseModel):
    doc_id: str
    title: str
    description: Optional[str] = ""
    due_date: str

class DeadlineUpdate(BaseModel):
    status: str

class DeadlineOut(BaseModel):
    id: int
    doc_id: str
    title: str
    description: str
    due_date: str
    status: str
    days_remaining: int

# Hearings
class HearingCreate(BaseModel):
    doc_id: str
    hearing_date: str
    court_name: Optional[str] = ""
    purpose: Optional[str] = ""

class HearingUpdate(BaseModel):
    status: Optional[str] = None
    outcome: Optional[str] = None

class HearingOut(BaseModel):
    id: int
    doc_id: str
    hearing_date: str
    court_name: str
    purpose: str
    outcome: str
    status: str

# Cases
class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    doc_ids: list[str] = []

class CaseOut(BaseModel):
    case_id: str
    title: str
    description: str
    doc_ids: list[str]

# Share links
class ShareLinkCreate(BaseModel):
    doc_id: Optional[str] = None
    case_id: Optional[str] = None
    expires_in_days: Optional[int] = 7

class ShareLinkOut(BaseModel):
    token: str
    share_url: str
    doc_id: Optional[str] = None
    case_id: Optional[str] = None
    expires_at: Optional[str] = None

# Risk score
class RiskScoreRequest(BaseModel):
    doc_id: str

class RiskScoreResponse(BaseModel):
    success: bool
    doc_id: str
    risk_score: int
    risk_level: str
    factors: list[str]
    message: str

# Similar cases
class SimilarCaseRequest(BaseModel):
    doc_id: str
    top_k: Optional[int] = 5

class SimilarCaseItem(BaseModel):
    case_title: str
    case_type: str
    similarity: int
    outcome: str
    court: str

class SimilarCaseResponse(BaseModel):
    success: bool
    doc_id: str
    similar_cases: list[SimilarCaseItem]
    message: str

# Lawyers + booking
class LawyerOut(BaseModel):
    id: int
    name: str
    specialization: str
    city: str
    experience_years: int
    rating: int
    fee_range: str
    languages: str
    bio: str
    contact: str
    match_score: Optional[int] = None

class LawyerMatchRequest(BaseModel):
    doc_id: Optional[str] = None
    case_type: Optional[str] = None
    city: Optional[str] = None

class BookingCreate(BaseModel):
    lawyer_id: int
    client_name: str
    client_contact: str
    doc_id: Optional[str] = None
    message: Optional[str] = ""

class BookingOut(BaseModel):
    id: int
    lawyer_id: int
    lawyer_name: str
    client_name: str
    status: str
    created_at: str

# Arguments
class ArgumentDraftRequest(BaseModel):
    doc_id: str
    stance: str
    key_points: Optional[str] = ""

class ArgumentDraftResponse(BaseModel):
    success: bool
    draft_id: int
    draft_text: str
    message: str

# History
class HistoryItem(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    status: str
    created_at: str
    qa_count: int


# -------------------------------
# SQLAlchemy ORM Models (DB layer)
# -------------------------------
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(String, unique=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    page_count = Column(Integer)
    extracted_text_length = Column(Integer)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
