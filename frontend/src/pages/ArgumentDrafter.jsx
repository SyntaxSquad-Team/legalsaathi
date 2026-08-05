import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { draftArgument } from "../services/api";

export default function ArgumentDrafter() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const [stance, setStance] = useState("petitioner");
  const [keyPoints, setKeyPoints] = useState("");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!docId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 text-sm mb-4">No document loaded.</p>
        <button onClick={() => navigate("/upload")}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
          Upload a Document
        </button>
      </div>
    );
  }

  async function handleDraft() {
    setLoading(true);
    setError(null);
    setDraft(null);
    try {
      const data = await draftArgument(docId, stance, keyPoints);
      setDraft(data.draft_text);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not generate draft.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Argument Drafter</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="mb-4">
          <label className="text-xs text-gray-500 font-medium block mb-1">Drafting for</label>
          <select value={stance} onChange={(e) => setStance(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white">
            <option value="petitioner">Petitioner</option>
            <option value="respondent">Respondent</option>
            <option value="accused / defendant">Accused / Defendant</option>
            <option value="complainant">Complainant</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500 font-medium block mb-1">Points to emphasise (optional)</label>
          <textarea value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} rows={3}
            placeholder="e.g. delay in filing FIR, lack of eyewitnesses"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
        </div>
        <button onClick={handleDraft} disabled={loading}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? "Drafting..." : "Generate Draft"}
        </button>
      </div>

      {loading && <Loader text="Drafting arguments from your document..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      {draft && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{draft}</p>
        </div>
      )}
    </div>
  );
}
