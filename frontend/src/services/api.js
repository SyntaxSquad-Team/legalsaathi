import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 90000 });

// Languages code map for Gemini prompts
export const LANGUAGES = [
  { code: "english",    label: "English",    gemini: "English" },
  { code: "hindi",      label: "Hindi",      gemini: "Hindi" },
  { code: "kannada",    label: "Kannada",    gemini: "Kannada" },
  { code: "tamil",      label: "Tamil",      gemini: "Tamil" },
  { code: "telugu",     label: "Telugu",     gemini: "Telugu" },
  { code: "marathi",    label: "Marathi",    gemini: "Marathi" },
  { code: "bengali",    label: "Bengali",    gemini: "Bengali" },
];

export async function uploadDocument(file, onUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data;
}

export async function getSummary(docId, language = "English") {
  const res = await api.post("/summary", { doc_id: docId, language });
  return res.data;
}

export async function askQuestion(docId, question) {
  const res = await api.post("/ask", { doc_id: docId, question });
  return res.data;
}

export async function getTimeline(docId, caseType = "civil", courtName = "District Court") {
  const res = await api.post("/timeline", {
    doc_id: docId,
    case_type: caseType,
    court_name: courtName,
  });
  return res.data;
}

//  Deadline alerts

export async function createDeadline(docId, title, description, dueDate) {
  const res = await api.post("/deadlines", { doc_id: docId, title, description, due_date: dueDate });
  return res.data;
}

export async function listDeadlines(docId) {
  const res = await api.get(`/deadlines/${docId}`);
  return res.data;
}

export async function upcomingDeadlineAlerts(withinDays = 7) {
  const res = await api.get(`/deadlines/alerts/upcoming?within_days=${withinDays}`);
  return res.data;
}

export async function updateDeadlineStatus(deadlineId, status) {
  const res = await api.patch(`/deadlines/${deadlineId}`, { status });
  return res.data;
}

export async function deleteDeadline(deadlineId) {
  const res = await api.delete(`/deadlines/${deadlineId}`);
  return res.data;
}

//  Case hearing tracker

export async function addHearing(docId, hearingDate, courtName, purpose) {
  const res = await api.post("/hearings", { doc_id: docId, hearing_date: hearingDate, court_name: courtName, purpose });
  return res.data;
}

export async function listHearings(docId) {
  const res = await api.get(`/hearings/${docId}`);
  return res.data;
}

export async function updateHearing(hearingId, payload) {
  const res = await api.patch(`/hearings/${hearingId}`, payload);
  return res.data;
}

export async function deleteHearing(hearingId) {
  const res = await api.delete(`/hearings/${hearingId}`);
  return res.data;
}

//  Case risk score

export async function getRiskScore(docId) {
  const res = await api.post("/risk-score", { doc_id: docId });
  return res.data;
}

//  Similar case finder

export async function getSimilarCases(docId, topK = 5) {
  const res = await api.post("/similar-cases", { doc_id: docId, top_k: topK });
  return res.data;
}

//  Lawyer directory, matching, booking

export async function listLawyers() {
  const res = await api.get("/lawyers");
  return res.data;
}

export async function matchLawyers(docId, caseType, city) {
  const res = await api.post("/lawyers/match", { doc_id: docId, case_type: caseType, city });
  return res.data;
}

export async function bookLawyer(lawyerId, clientName, clientContact, docId, message) {
  const res = await api.post("/lawyers/book", {
    lawyer_id: lawyerId, client_name: clientName, client_contact: clientContact, doc_id: docId, message,
  });
  return res.data;
}

export async function getMyBookings(clientContact) {
  const res = await api.get(`/lawyers/bookings/${encodeURIComponent(clientContact)}`);
  return res.data;
}

//  Argument drafter

export async function draftArgument(docId, stance, keyPoints) {
  const res = await api.post("/argument-draft", { doc_id: docId, stance, key_points: keyPoints });
  return res.data;
}

export async function listArgumentDrafts(docId) {
  const res = await api.get(`/argument-draft/${docId}`);
  return res.data;
}

//  Document history

export async function getDocumentHistory() {
  const res = await api.get("/history");
  return res.data;
}

export async function getDocumentQAHistory(docId) {
  const res = await api.get(`/history/${docId}/qa`);
  return res.data;
}
