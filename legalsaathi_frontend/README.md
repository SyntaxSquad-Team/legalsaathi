# LegalSaathi — Frontend

React + Tailwind frontend for LegalSaathi.

## Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Install Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Start the app
```bash
npm start
```

Runs at: http://localhost:3000

Make sure the backend is running at http://localhost:8000 before starting.

---

## Pages

| Route      | Page     | What it does                              |
|------------|----------|-------------------------------------------|
| /          | Upload   | Upload court document, triggers OCR       |
| /summary   | Summary  | Shows plain-language case summary         |
| /chat      | Chat     | Q&A with the uploaded document            |
| /timeline  | Timeline | Predicts next hearing and case duration   |

---

## Folder Structure

```
src/
├── pages/
│   ├── Upload.jsx       <- File upload + OCR trigger
│   ├── Summary.jsx      <- Case summary display
│   ├── Chat.jsx         <- Q&A chat interface
│   └── Timeline.jsx     <- Timeline prediction
├── components/
│   ├── Navbar.jsx       <- Top navigation
│   ├── FileUploader.jsx <- Drag and drop file input
│   ├── ChatBubble.jsx   <- Chat message with citations
│   ├── TimelineCard.jsx <- Timeline result display
│   └── Loader.jsx       <- Spinner component
├── services/
│   └── api.js           <- All API calls (axios)
├── context/
│   └── DocContext.jsx   <- Global doc_id and summary state
├── App.jsx              <- Routes + layout
└── index.js             <- Entry point
```
