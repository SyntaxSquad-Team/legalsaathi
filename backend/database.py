from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


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


class QAHistory(Base):
    __tablename__ = "qa_history"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    doc_id     = Column(String, nullable=False)
    question   = Column(Text, nullable=False)
    answer     = Column(Text, nullable=False)
    citations  = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()