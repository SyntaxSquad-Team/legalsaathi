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


#  Deadlines

class DeadlineCreate(BaseModel):
    doc_id: str
    title: str
    description: Optional[str] = ""
    due_date: str    # ISO date string, e.g. "2026-08-20"


class DeadlineUpdate(BaseModel):
    status: str      # pending | done | missed


class DeadlineOut(BaseModel):
    id: int
    doc_id: str
    title: str
    description: str
    due_date: str
    status: str
    days_remaining: int


#  Hearings (case hearing tracker)

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


#  Multi-document case linking

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    doc_ids: list[str] = []


class CaseOut(BaseModel):
    case_id: str
    title: str
    description: str
    doc_ids: list[str]


#  Shareable read-only links

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


#  Case risk score

class RiskScoreRequest(BaseModel):
    doc_id: str


class RiskScoreResponse(BaseModel):
    success: bool
    doc_id: str
    risk_score: int              # 0-100
    risk_level: str              # Low | Medium | High
    factors: list[str]
    message: str


#  Similar case finder

class SimilarCaseRequest(BaseModel):
    doc_id: str
    top_k: Optional[int] = 5


class SimilarCaseItem(BaseModel):
    case_title: str
    case_type: str
    similarity: int              # 0-100
    outcome: str
    court: str


class SimilarCaseResponse(BaseModel):
    success: bool
    doc_id: str
    similar_cases: list[SimilarCaseItem]
    message: str


#  Lawyer matching + directory + booking

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


#  Argument drafter

class ArgumentDraftRequest(BaseModel):
    doc_id: str
    stance: str            # e.g. "petitioner", "defendant/accused"
    key_points: Optional[str] = ""


class ArgumentDraftResponse(BaseModel):
    success: bool
    draft_id: int
    draft_text: str
    message: str


#  Document history

class HistoryItem(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    status: str
    created_at: str
    qa_count: int
