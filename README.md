# LegalSaathi

AI-powered legal assistant for Indian litigants. Upload a court document, get a plain-language summary, ask questions about your case, and predict your next hearing date.

Built for InnovaHack Chapter 1 — Gen AI Track.

---

## What It Does

- Upload any court document (FIR, chargesheet, bail order, hearing order)
- Get a plain-language summary in 7 Indian languages (English, Hindi, Kannada, Tamil, Telugu, Marathi, Bengali)
- Ask questions about your case — answers are cited from your document
- Predict next hearing date based on eCourts historical data
- Zero hallucination — the AI cannot answer outside your uploaded document

---

## Project Structure

```
legalsaathi/
├── ai/                — RAG pipeline (chunking, embeddings, retrieval, Gemini)
│   ├── chroma_store/   — local vector store (auto-created)
│   ├── chunker.py
│   ├── embeddings.py
│   ├── gemini_client.py
│   ├── pipeline.py
│   ├── prompt.py
│   └── retriever.py
├── backend/            — FastAPI server + API endpoints
│   ├── routes/
│   ├── services/
│   ├── uploads/         — gitignored
│   ├── .env             — gitignored, create from .env.example
│   ├── .env.example
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── frontend/            — React + Tailwind UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/   — e.g. Navbar
│   │   ├── context/
│   │   ├── pages/        — e.g. Login, Dashboard
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

Note: `ai/` sits at the project root alongside `backend/` and `frontend/` — it is not nested inside `backend/`.

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Download |
|---|---|---|
| Python | 3.10 or above | https://python.org |
| Node.js | 18 or above | https://nodejs.org |
| Tesseract OCR | Latest | See below |
| Git | Any | https://git-scm.com |

### Install Tesseract OCR

**Windows:**
Download and install from:
https://github.com/UB-Mannheim/tesseract/wiki

After installing, add Tesseract to your system PATH.
Default install path: `C:\Program Files\Tesseract-OCR`

**Mac:**
```bash
brew install tesseract
brew install tesseract-lang
```

**Linux (Ubuntu):**
```bash
sudo apt install tesseract-ocr
sudo apt install tesseract-ocr-hin
```

### Get a Free Gemini API Key

1. Go to https://aistudio.google.com/
2. Sign in with a Google account
3. Click "Get API Key"
4. Copy the key — you will need it in Step 3 below

---

## Step-by-Step Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourteam/legalsaathi.git
cd legalsaathi
```

---

### Step 2 — Set Up the Backend

Open a terminal and run:

```bash
cd backend
```

Create a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac / Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

Install all dependencies:

```bash
pip install -r requirements.txt
```

---

### Step 3 — Add Your API Key

Inside the `backend/` folder, create a file called `.env`:

```bash
cp .env.example .env
```

Open `.env` in any text editor and fill in your Gemini API key:

```
GEMINI_API_KEY=paste_your_key_here
ECOURTS_API_KEY=
DATABASE_URL=sqlite:///./legalsaathi.db
UPLOAD_DIR=uploads
CHROMA_DIR=../ai/chroma_store
```

Leave `ECOURTS_API_KEY` blank for now — the app will use mock data for timeline prediction which is fine for the demo.

---

### Step 4 — Run the Backend

Make sure you are still inside `backend/` with the virtual environment active.

Since `ai/` lives one level up at the project root, you need to add the project root to `PYTHONPATH` so `main.py` can import from `ai/`:

**Windows (PowerShell):**
```powershell
$env:PYTHONPATH=".."
uvicorn main:app --reload
```

**Mac / Linux:**
```bash
export PYTHONPATH=..
uvicorn main:app --reload
```

Note: `PYTHONPATH` is set per terminal session — if you close and reopen the terminal, run that line again before `uvicorn`.

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
LegalSaathi API is running.
```

Open http://localhost:8000/docs in your browser to see all API endpoints with live testing.

Keep this terminal open. The backend must stay running.

---

### Step 5 — Set Up the Frontend

Open a new terminal (keep the backend terminal running):

```bash
cd frontend
npm install
```

Install Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Step 6 — Run the Frontend

```bash
npm start
```

The app opens automatically at http://localhost:3000

---

## How to Use the App

1. Open http://localhost:3000
2. Log in, then on the Upload page, drag and drop a court document PDF
3. Wait for OCR and summary generation (10 to 30 seconds depending on document size)
4. You are taken to the Summary page automatically — choose your summary language from the 7 available
5. Click "Ask Questions" to open the chat interface
6. Type any question about your case or pick from the suggested questions
7. Click "Timeline" to predict the next hearing date

---

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | What It Does |
|---|---|---|
| POST | /api/upload | Upload a PDF or image, triggers OCR and embedding |
| POST | /api/summary | Get plain-language case summary for a document |
| POST | /api/ask | Ask a question, get cited answer from the document |
| POST | /api/timeline | Predict next hearing date and case duration |
| GET | / | Health check |

Full interactive docs: http://localhost:8000/docs

---

## Common Errors and Fixes

**"tesseract is not installed or not in PATH"**
Tesseract is not installed or not added to PATH.
On Windows, go to System Properties > Environment Variables and add the Tesseract install folder to PATH. Restart your terminal after.

**"GEMINI_API_KEY not set"**
The .env file is missing or the key is blank. Open backend/.env and paste your key.

**"CORS error" in browser console**
The backend is not running. Open a terminal, go to backend/, activate venv, and run `uvicorn main:app --reload`.

**"npm command not found"**
Node.js is not installed. Download from https://nodejs.org and install, then reopen your terminal.

**"Module not found" in Python**
The virtual environment is not activated. Run `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux) before running uvicorn.

**"ModuleNotFoundError: No module named 'ai'"**
`PYTHONPATH` is not set. Run `$env:PYTHONPATH=".."` (Windows PowerShell) or `export PYTHONPATH=..` (Mac/Linux) in the same terminal, before `uvicorn main:app --reload`.

**Upload takes too long**
Large scanned PDFs take longer because every page goes through OCR. For demo, use a small 2 to 5 page document.

---

## Git Workflow

Work on feature branches rather than committing straight to `main`:

```bash
git checkout -b backend        # or ai-pipeline, frontend, etc.
```

Save progress every 1 to 2 hours:

```bash
git add .
git commit -m "brief description of what you built"
git push origin your-branch-name
```

Merge into main once a piece is working:

```bash
git checkout main
git merge your-branch-name
git push origin main
```

Everyone pulls after a merge:

```bash
git pull origin main
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Axios, React Router |
| Backend | FastAPI, Python 3.10 |
| OCR | Tesseract, PyMuPDF |
| RAG Pipeline | LangChain, ChromaDB |
| LLM | Gemini 1.5 Flash (free tier) |
| Embeddings | Gemini Embedding API |
| Database | SQLite via SQLAlchemy |
| Case Data | eCourts Public API (mock fallback included) |

---

## Notes

- ChromaDB stores vectors locally in `ai/chroma_store/` — no cloud needed
- SQLite database (`legalsaathi.db`) is created automatically on first run inside `backend/`
- The `.env` file and `uploads/` folder are gitignored — never commit them
- eCourts API key is optional — mock timeline data is used if not set
