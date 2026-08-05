from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import upload, qa, timeline, deadlines, hearings, cases, share, risk, similar_cases, lawyers, argument, export, history

app = FastAPI(
    title="LegalSaathi API",
    description="AI-powered legal assistant for Indian litigants",
    version="1.0.0"
)

#  CORS — allow React frontend to talk to this server 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://legalsaathi-pi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Register routes 
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(qa.router,     prefix="/api", tags=["Q&A"])
app.include_router(timeline.router, prefix="/api", tags=["Timeline"])
app.include_router(deadlines.router, prefix="/api", tags=["Deadlines"])
app.include_router(hearings.router, prefix="/api", tags=["Hearing Tracker"])
app.include_router(cases.router, prefix="/api", tags=["Case Linking"])
app.include_router(share.router, prefix="/api", tags=["Shareable Links"])
app.include_router(risk.router, prefix="/api", tags=["Risk Score"])
app.include_router(similar_cases.router, prefix="/api", tags=["Similar Cases"])
app.include_router(lawyers.router, prefix="/api", tags=["Lawyers"])
app.include_router(argument.router, prefix="/api", tags=["Argument Drafter"])
app.include_router(export.router, prefix="/api", tags=["Export"])
app.include_router(history.router, prefix="/api", tags=["History"])


#  DB init on startup 
@app.on_event("startup")
def startup():
    init_db()
    print("LegalSaathi API is running.")


#  Health check 
@app.get("/")
def root():
    return {"status": "ok", "message": "LegalSaathi API is live."}



