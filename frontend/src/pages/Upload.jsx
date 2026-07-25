import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import Loader from "../components/Loader";
import { uploadDocument, getSummary, LANGUAGES } from "../services/api";
import { useDoc } from "../context/DocContext";
import { usePlan } from "../context/PlanContext";

export default function Upload() {
  const navigate = useNavigate();
  const { setDocument, setSummary, setSummaryLang } = useDoc();
  const { canUpload, recordUpload, limits, uploadCount } = usePlan();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [stage, setStage]         = useState("");
  const [error, setError]         = useState(null);
  const [lang, setLang]           = useState("English");

  async function handleFileSelect(file) {
    if (!canUpload) return;

    setError(null);
    setUploading(true);

    try {
      setStage("Uploading and extracting text from document...");
      const uploadData = await uploadDocument(file, (evt) => {
        setProgress(Math.round((evt.loaded * 100) / evt.total));
      });
      setDocument(uploadData);
      recordUpload();

      setStage(`Generating summary in ${lang}...`);
      const summaryData = await getSummary(uploadData.doc_id, lang);
      setSummary(summaryData.summary);
      setSummaryLang(lang);

      navigate("/summary");
    } catch (err) {
      setError(err?.response?.data?.detail || "Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
      setProgress(0);
      setStage("");
    }
  }

  if (!canUpload) {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Upload Court Document</h1>
        <p className="text-sm text-gray-400 mb-6">
          Upload any court document. We will extract the text, generate a summary, and index it for Q&A.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            You've used all {limits.maxUploads} uploads on the Free plan
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Upgrade to Pro for unlimited document uploads.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Upload Court Document</h1>
      <p className="text-sm text-gray-400 mb-6">
        Upload any court document. We will extract the text, generate a summary, and index it for Q&A.
      </p>

      {limits.maxUploads !== Infinity && (
        <p className="text-xs text-gray-400 mb-4">
          {uploadCount} of {limits.maxUploads} uploads used on the Free plan.
        </p>
      )}

      {/* Language selector */}
      <div className="mb-5">
        <label className="text-xs text-gray-500 font-medium block mb-1">Summary Language</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.gemini)}
              disabled={uploading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${lang === l.gemini
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Summary will be generated in {lang}. You can regenerate it in another language from the Summary page.
        </p>
      </div>

      {!uploading ? (
        <FileUploader onFileSelect={handleFileSelect} uploading={uploading} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <Loader text={stage} />
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading</span><span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-medium text-blue-500 mb-1.5">Supported documents</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>FIR (First Information Report)</li>
          <li>Chargesheet</li>
          <li>Bail orders and court orders</li>
          <li>Previous hearing notes</li>
          <li>Any typed or scanned court document</li>
        </ul>
      </div>
    </div>
  );
}