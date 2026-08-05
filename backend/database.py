from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Table: uploaded documents

class Document(Base):
    __tablename__ = "documents"

    doc_id              = Column(String, primary_key=True, index=True)
    filename            = Column(String, nullable=False)
    file_path           = Column(String, nullable=False)
    page_count          = Column(Integer, default=0)
    extracted_text      = Column(Text, default="")
    extracted_text_len  = Column(Integer, default=0)
    status              = Column(String, default="processing")  # processing | ready | failed
    created_at          = Column(DateTime, default=datetime.utcnow)


#  Table: Q&A history

class QAHistory(Base):
    __tablename__ = "qa_history"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    doc_id      = Column(String, nullable=False)
    question    = Column(Text, nullable=False)
    answer      = Column(Text, nullable=False)
    citations   = Column(Text, default="[]")   # stored as JSON string
    created_at  = Column(DateTime, default=datetime.utcnow)


#  Table: Deadlines (deadline alerts)

class Deadline(Base):
    __tablename__ = "deadlines"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    doc_id      = Column(String, nullable=False, index=True)
    title       = Column(String, nullable=False)
    description = Column(Text, default="")
    due_date    = Column(DateTime, nullable=False)
    status      = Column(String, default="pending")   # pending | done | missed
    created_at  = Column(DateTime, default=datetime.utcnow)


#  Table: Case hearings (hearing tracker)

class Hearing(Base):
    __tablename__ = "hearings"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    doc_id      = Column(String, nullable=False, index=True)
    hearing_date = Column(DateTime, nullable=False)
    court_name  = Column(String, default="")
    purpose     = Column(String, default="")
    outcome     = Column(Text, default="")
    status      = Column(String, default="upcoming")  # upcoming | completed | adjourned
    created_at  = Column(DateTime, default=datetime.utcnow)


#  Table: Cases (groups multiple documents together)

class Case(Base):
    __tablename__ = "cases"

    case_id     = Column(String, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    description = Column(Text, default="")
    created_at  = Column(DateTime, default=datetime.utcnow)


class CaseDocument(Base):
    __tablename__ = "case_documents"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    case_id  = Column(String, nullable=False, index=True)
    doc_id   = Column(String, nullable=False, index=True)
    added_at = Column(DateTime, default=datetime.utcnow)


#  Table: Shareable read-only case links

class ShareLink(Base):
    __tablename__ = "share_links"

    token       = Column(String, primary_key=True, index=True)
    doc_id      = Column(String, nullable=True, index=True)
    case_id     = Column(String, nullable=True, index=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    expires_at  = Column(DateTime, nullable=True)
    revoked     = Column(Integer, default=0)   # 0 = active, 1 = revoked
    view_count  = Column(Integer, default=0)


#  Table: Lawyers directory

class Lawyer(Base):
    __tablename__ = "lawyers"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    name         = Column(String, nullable=False)
    specialization = Column(String, nullable=False)   # e.g. "criminal", "family", "civil"
    city         = Column(String, default="")
    experience_years = Column(Integer, default=0)
    rating       = Column(Integer, default=4)          # 1-5
    fee_range    = Column(String, default="")
    languages    = Column(String, default="English")
    bio          = Column(Text, default="")
    contact      = Column(String, default="")


class LawyerBooking(Base):
    __tablename__ = "lawyer_bookings"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    lawyer_id   = Column(Integer, nullable=False, index=True)
    doc_id      = Column(String, nullable=True)
    client_name = Column(String, nullable=False)
    client_contact = Column(String, nullable=False)
    message     = Column(Text, default="")
    status      = Column(String, default="requested")  # requested | confirmed | cancelled
    created_at  = Column(DateTime, default=datetime.utcnow)


#  Table: Argument drafts

class ArgumentDraft(Base):
    __tablename__ = "argument_drafts"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    doc_id      = Column(String, nullable=False, index=True)
    stance      = Column(String, default="")           # e.g. "for petitioner"
    draft_text  = Column(Text, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


# Create all tables on startup
def init_db():
    Base.metadata.create_all(bind=engine)


# Dependency: get DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
