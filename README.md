# LegalSaathi

AI-powered legal assistant for Indian litigants. Upload a court document, get a plain-language summary, ask questions about your case, track hearings and deadlines, and even connect with lawyers.

Built for **InnovaHack Hackathon — Open Innovation Track (Gen AI)**.

---

## What It Does

- **AI Document Processing** — Extracts text from scanned and digital legal documents using OCR
- **Case Summarization** — Converts complex legal language into simple summaries in 7 Indian languages
- **Document-Based Question Answering** — Ask questions about your uploaded documents and get cited responses generated using RAG
- **Hearing Timeline Prediction** — Predicts the next hearing date and estimated case duration using eCourts historical data
- **Deadline Alerts** — Notifies users about upcoming hearing dates and important case deadlines
- **Hearing Tracker** — Displays the current status and progress of the case across hearings
- **Risk Score** — Analyzes case information to estimate potential legal risks and highlights important concerns
- **Similar Cases** — Finds relevant past cases to help users understand similar legal situations
- **AI Argument Drafter** — Generates structured legal arguments and supporting points based on uploaded case documents
- **Find a Lawyer** — Helps users locate suitable lawyers based on their case type and location
- **Document History** — Stores previously uploaded documents and enables quick access to past case records

---

## How LegalSaathi Is Different

Unlike generic AI models such as ChatGPT or other assistants:

- **Document-grounded answers only**
  LegalSaathi never invents facts. Summaries and Q&A are strictly based on the uploaded document. If the answer isn't in the document, the system clearly says so.
- **No hallucinations**
  The AI is instructed to avoid external knowledge and speculation, ensuring reliability in sensitive legal contexts.
- **Strict citation rules**
  Every answer cites the exact chunk of the document it came from, so users can verify the source.
- **Fallback reliability**
  Primary generation uses **Google Gemini 2.0 Flash Lite**. If Gemini is unavailable, LegalSaathi falls back to **Groq LLaMA-3.3-70B Versatile**, ensuring uninterrupted service.
- **Legal context focus**
  Prompts are carefully designed to simplify legal language for litigants, unlike general-purpose chatbots.

This makes LegalSaathi a **trustworthy legal-tech assistant** rather than a generic conversational AI.

---

## Project Structure
---
```
legalsaathi/
├── backend/            — FastAPI server + AI pipeline + API endpoints
│   ├── ai/              — RAG pipeline (chunking, embeddings, retrieval, Gemini/Groq)
│   │   ├── chunker.py
│   │   ├── embeddings.py
│   │   ├── gemini_client.py
│   │   ├── pipeline.py
│   │   ├── prompt.py
│   │   └── retriever.py
│   ├── routes/          — Upload, Q&A, Timeline, Deadlines, Hearings, Cases, Share, Risk, Similar Cases, Lawyers, Argument, Export, History
│   ├── services/         — OCR, PDF export, eCourts API, risk engine, lawyer seeding, file storage
│   ├── uploads/          — gitignored
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── frontend/            — React + Tailwind UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
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

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Tesseract OCR | Latest | [Tesseract Wiki](https://github.com/UB-Mannheim/tesseract/wiki) |
| Git | Any | [git-scm.com](https://git-scm.com) |
| Pinecone Account | — | [pinecone.io](https://pinecone.io) |

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a `.env` file from `.env.example`:

```env
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_groq_key_here
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=legalsaathi
ECOURTS_API_KEY=
DATABASE_URL=sqlite:///./legalsaathi.db
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

Run the backend:

```bash
uvicorn main:app --reload
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
cd frontend
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/upload` | Upload a PDF/image, OCR + embeddings |
| POST | `/api/ask` | Ask a question, get a cited answer |
| POST | `/api/summary` | Generate plain-language summary |
| POST | `/api/timeline` | Predict next hearing date |
| POST | `/api/deadlines` | Create a deadline |
| GET | `/api/deadlines/{id}` | List deadlines |
| POST | `/api/hearings` | Add a hearing |
| GET | `/api/hearings/{id}` | List hearings |
| POST | `/api/cases` | Create a case linking documents |
| POST | `/api/risk-score` | Compute risk score |
| POST | `/api/similar-case` | Find similar past cases |
| GET | `/api/export/summary` | Download summary as PDF |
| POST | `/api/share` | Create shareable link |
| GET | `/api/history` | Document + Q&A history |
| GET | `/api/health` | Health check |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS |
| OCR | Tesseract, PyMuPDF |
| AI Pipeline | LangChain, Pinecone, Gemini 2.0 Flash Lite, Groq LLaMA-3.3-70B |
| Database | SQLite via SQLAlchemy |
| Case Data | eCourts API (mock fallback included) |

---

## Notes

- `.env` and `uploads/` are gitignored — never commit them.
- SQLite DB (`legalsaathi.db`) is auto-created on first run.
- Pinecone stores embeddings for semantic search.
- eCourts API key is optional — mock data is used if not set.
- Summaries and arguments are AI-generated aids — **not legal advice**.
