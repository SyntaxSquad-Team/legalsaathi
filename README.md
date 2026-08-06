# LegalSaathi

AI-powered legal assistant for Indian litigants. Upload a court document, get a plain-language summary, ask questions about your case, track hearings and deadlines, and even connect with lawyers.

Built for **InnovaHack Hackathon — Open Innovation Track (Gen AI)**.

---

## What It Does

- Upload court documents (FIR, chargesheet, bail order, hearing order, etc.)
- Extract text via OCR (supports English + Hindi)
- Get a plain-language summary in multiple Indian languages
- Ask questions about your case ,answers are cited from your document
- Predict next hearing date based on eCourts historical data
- Track deadlines and hearings with alerts
- Link multiple documents into a single case
- Compute risk scores based on document content
- Find similar past cases for precedent awareness
- Export summaries as PDFs
- Share documents/cases via secure links
- Browse, match, and book lawyers

---

## How LegalSaathi is Different

Unlike generic AI models such as ChatGPT or other assistants:

- **Document-grounded answers only**  
  LegalSaathi never invents facts. Summaries and Q&A are strictly based on the uploaded document. If the answer isn’t in the document, the system clearly says so.

- **No hallucinations**  
  The AI is instructed to avoid external knowledge and speculation. This ensures reliability in sensitive legal contexts.

- **Strict citation rules**  
  Every answer cites the exact chunk of the document it came from, so users can verify the source.

- **Fallback reliability**  
  Primary generation uses **Google Gemini 2.0 Flash Lite**. If Gemini is unavailable, LegalSaathi falls back to **Groq LLaMA‑3.3‑70B Versatile**, ensuring uninterrupted service.

- **Legal context focus**  
  Prompts are carefully designed to simplify legal language for litigants, unlike general-purpose chatbots.

This makes LegalSaathi a **trustworthy legal-tech assistant** rather than a generic conversational AI.

---

## Project Structure

legalsaathi/

├── backend/            — FastAPI server + AI pipeline + API endpoints
│   ├── ai/             — RAG pipeline (chunking, embeddings, retrieval, Gemini/Groq)
│   │   ├── chunker.py
│   │   ├── embeddings.py
│   │   ├── gemini_client.py
│   │   ├── pipeline.py
│   │   ├── prompt.py
│   │   └── retriever.py
│   ├── routes/         — Upload, Q&A, Timeline, Deadlines, Hearings, Cases, Share, Risk, Similar Cases, Lawyers, Argument, Export, History
│   ├── services/       — OCR, PDF export, eCourts API, risk engine, lawyer seeding, file storage
│   ├── uploads/        — gitignored
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── frontend/           — React + Tailwind UI
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

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Tesseract OCR | Latest | [Tesseract Wiki](https://github.com/UB-Mannheim/tesseract/wiki) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt


