import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds — OCR + embedding can take time
});


// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Upload a PDF/image file.
 * Returns { success, doc_id, filename, page_count, message }
 */
export async function uploadDocument(file, onUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return response.data;
}


// ── Summary ───────────────────────────────────────────────────────────────────

/**
 * Get a plain-language summary for an uploaded document.
 * Returns { success, summary, doc_id, message }
 */
export async function getSummary(docId) {
  const response = await api.post("/summary", { doc_id: docId });
  return response.data;
}


// ── Q&A ───────────────────────────────────────────────────────────────────────

/**
 * Ask a question about a document.
 * Returns { success, answer, citations, message }
 */
export async function askQuestion(docId, question) {
  const response = await api.post("/ask", {
    doc_id: docId,
    question,
  });
  return response.data;
}


// ── Timeline ──────────────────────────────────────────────────────────────────

/**
 * Predict the next hearing date and case duration.
 * Returns { success, predicted_next_hearing, estimated_duration_months, confidence, based_on_cases }
 */
export async function getTimeline(docId, caseType = "civil", courtName = "District Court") {
  const response = await api.post("/timeline", {
    doc_id: docId,
    case_type: caseType,
    court_name: courtName,
  });
  return response.data;
}
