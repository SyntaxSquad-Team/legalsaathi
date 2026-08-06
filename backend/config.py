import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ECOURTS_API_KEY = os.getenv("ECOURTS_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./legalsaathi.db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Make sure upload folder exists
os.makedirs(UPLOAD_DIR, exist_ok=True)
