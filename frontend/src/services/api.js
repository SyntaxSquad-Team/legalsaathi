import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 90000 });

// Language code map for Gemini prompts
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
