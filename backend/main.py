from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import upload, qa, timeline

app = FastAPI(
    title="LegalSaathi API",
    description="AI-powered legal assistant for Indian litigants",
    version="1.0.0"
)

# ── CORS — allow React frontend to talk to this server ────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routes ───────────────────────────────────────────────────────────
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(qa.router,     prefix="/api", tags=["Q&A"])
app.include_router(timeline.router, prefix="/api", tags=["Timeline"])


# ── DB init on startup ────────────────────────────────────────────────────────
@app.on_event("startup")
def startup():
    init_db()
    print("LegalSaathi API is running.")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "LegalSaathi API is live."}


# ── Run locally ───────────────────────────────────────────────────────────────
# Run with: uvicorn main:app --reload
