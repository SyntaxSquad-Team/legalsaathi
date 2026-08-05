# feature-meena-test — new files & changes

This folder contains only the files that are new or modified compared to `main`.
The folder structure matches your repo exactly (`backend/...`, `frontend/...`, root),
so you can copy it straight over your local checkout of `feature-meena-test`.

## New backend files
- backend/routes/deadlines.py       — Deadline Alerts
- backend/routes/hearings.py        — Case Hearing Tracker
- backend/routes/cases.py           — Multi-Document Case Linking
- backend/routes/share.py           — Shareable Read-Only Case Links
- backend/routes/risk.py            — Case Risk Score
- backend/routes/similar_cases.py   — Similar-Case Finder
- backend/routes/lawyers.py         — Lawyer Matching + Booking + Directory
- backend/routes/argument.py        — Argument Drafter
- backend/routes/export.py          — Export Summary as PDF
- backend/routes/history.py         — Document History
- backend/services/risk_engine.py
- backend/services/similar_case_finder.py
- backend/services/lawyer_seed.py
- backend/services/pdf_export.py

## Modified backend files
- backend/database.py   — new tables (Deadline, Hearing, Case, CaseDocument, ShareLink, Lawyer, LawyerBooking, ArgumentDraft)
- backend/models.py      — new Pydantic schemas for all the above
- backend/main.py        — registers all new routers
- backend/config.py       — adds FRONTEND_URL (used to build share links)
- backend/requirements.txt / requirements.txt — adds `fpdf2` for PDF export

## New frontend files
- frontend/src/pages/Landing.jsx        — public landing page
- frontend/src/pages/Deadlines.jsx
- frontend/src/pages/Hearings.jsx
- frontend/src/pages/CaseLinks.jsx
- frontend/src/pages/Lawyers.jsx
- frontend/src/pages/RiskScore.jsx
- frontend/src/pages/SimilarCases.jsx
- frontend/src/pages/ShareCase.jsx
- frontend/src/pages/SharedView.jsx     — public read-only view at /shared/:token
- frontend/src/pages/ArgumentDrafter.jsx
- frontend/src/pages/History.jsx

## Modified frontend files
- frontend/src/App.jsx           — new routes + landing page wiring
- frontend/src/components/Navbar.jsx — new sidebar links
- frontend/src/services/api.js   — API calls for every new endpoint
- frontend/src/pages/Summary.jsx — added "Export as PDF" button
- frontend/src/index.css / public/index.html — adds the Fraunces display font used on the landing page

Everything was tested: the backend boots and all new routes respond correctly
(`uvicorn main:app`), and `npm run build` compiles the frontend with no errors.

Lawyer directory data is seeded automatically (8 sample lawyers across specializations
and cities) the first time `/api/lawyers` is called — no manual setup needed.

See the chat response for step-by-step run and merge instructions.
