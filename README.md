# LegalSaathi — Backend

AI-powered legal assistant for Indian litigants.

## Setup

### 1. Clone and navigate
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Mac / Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
```bash
cp .env.example .env
# Open .env and add your GEMINI_API_KEY
```

Get your free Gemini API key at: https://aistudio.google.com/

### 5. Run the server
```bash
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

API docs at: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/upload | Upload a court document PDF |
| POST | /api/ask | Ask a question about a document |
| POST | /api/summary | Get plain-language case summary |
| POST | /api/timeline | Predict next hearing and duration |
| GET | / | Health check |

---

## Member Responsibilities

| Member | Folder | Files |
|---|---|---|
| Member 1 | backend/ | main.py, config.py, models.py, database.py, routes/, services/ |
| Member 2 | ai/ | pipeline.py, chunker.py, embeddings.py, retriever.py, prompt.py, gemini_client.py |
| Member 3 | frontend/ | All React files |

---

## Notes

- eCourts API key is optional. Without it, mock timeline data is used (works for demo).
- ChromaDB stores vectors locally in ai/chroma_store/ — no cloud needed.
- SQLite database is created automatically on first run.
