import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ECOURTS_API_KEY = os.getenv("ECOURTS_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./legalsaathi.db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
CHROMA_DIR = os.getenv("CHROMA_DIR", "../ai/chroma_store")

# Make sure upload folder exists
os.makedirs(UPLOAD_DIR, exist_ok=True)
