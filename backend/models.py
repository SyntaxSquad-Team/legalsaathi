# -------------------------------
# Pydantic Schemas (API layer)
# -------------------------------
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import relationship
from backend.database import init_db
from backend.database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey

class Hearing(Base):
    __tablename__ = "hearings"
    __table_args__ = {'extend_existing': True}

    id          = Column(Integer, primary_key=True, index=True)
    doc_id      = Column(String, nullable=False)
    hearing_date = Column(DateTime, nullable=False)
    court_name  = Column(String, default="")
    purpose     = Column(Text, default="")
    outcome     = Column(Text, default="")
    status      = Column(String, default="scheduled")
    created_at  = Column(DateTime, default=datetime.utcnow)


class Deadline(Base):
    __tablename__ = "deadlines"
    __table_args__ = {'extend_existing': True}

    id          = Column(Integer, primary_key=True, index=True)
    doc_id      = Column(String, nullable=False)
    title       = Column(String, nullable=False)
    description = Column(Text, default="")
    due_date    = Column(DateTime, nullable=False)
    status      = Column(String, default="pending")
    created_at  = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"

    doc_id             = Column(String, primary_key=True, index=True)
    filename           = Column(String, nullable=False)
    file_path          = Column(String, nullable=False)
    page_count         = Column(Integer, default=0)
    extracted_text     = Column(Text, default="")
    extracted_text_len = Column(Integer, default=0)
    status             = Column(String, default="processing")
    created_at         = Column(DateTime, default=datetime.utcnow)




class ArgumentDraft(Base):
    __tablename__ = "argument_drafts"
    __table_args__ = {'extend_existing': True}

    id         = Column(Integer, primary_key=True, index=True)
    doc_id     = Column(String, nullable=False)
    stance     = Column(String, nullable=False)
    key_points = Column(Text, default="")
    draft_text = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class CaseDocument(Base):
    __tablename__ = "case_documents"
    __table_args__ = {'extend_existing': True}

    id          = Column(Integer, primary_key=True, index=True)
    case_id     = Column(Integer, ForeignKey("cases.id"))
    doc_id      = Column(String, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Lawyer(Base):
    __tablename__ = "lawyers"
    __table_args__ = {'extend_existing': True}

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String, nullable=False)
    specialization   = Column(String, nullable=False)
    city             = Column(String, nullable=False)
    experience_years = Column(Integer, default=0)
    rating           = Column(Integer, default=0)
    fee_range        = Column(String, default="")
    languages        = Column(String, default="")
    bio              = Column(Text, default="")
    contact          = Column(String, default="")


class LawyerBooking(Base):
    __tablename__ = "lawyer_bookings"
    __table_args__ = {'extend_existing': True}

    id           = Column(Integer, primary_key=True, index=True)
    lawyer_id    = Column(Integer, ForeignKey("lawyers.id"))
    client_name  = Column(String, nullable=False)
    client_contact = Column(String, nullable=False)
    doc_id       = Column(String, default="")
    message      = Column(Text, default="")
    status       = Column(String, default="pending")
    created_at   = Column(DateTime, default=datetime.utcnow)


class ShareLink(Base):
    __tablename__ = "share_links"
    __table_args__ = {'extend_existing': True}

    id          = Column(Integer, primary_key=True, index=True)
    token       = Column(String, unique=True, nullable=False)
    share_url   = Column(String, nullable=False)
    doc_id      = Column(String, default=None)
    case_id     = Column(Integer, ForeignKey("cases.id"), nullable=True)
    expires_at  = Column(DateTime, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)



class QAHistory(Base):
    __tablename__ = "qa_history"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    doc_id     = Column(String, nullable=False)
    question   = Column(Text, nullable=False)
    answer     = Column(Text, nullable=False)
    citations  = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)
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






class Case(Base):
    __tablename__ = "cases"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
