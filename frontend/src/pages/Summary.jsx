import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getSummary, LANGUAGES } from "../services/api";
import { useDoc } from "../context/DocContext";

export default function Summary() {
  const navigate = useNavigate();
  const { docId, filename, summary, pageCount, summaryLang, setSummary, setSummaryLang } = useDoc();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [activeLang, setActiveLang] = useState(summaryLang || "English");

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

  async function handleLangChange(lang) {
    if (lang === activeLang) return;
    setError(null);
    setLoading(true);
    setActiveLang(lang);
    try {
      const data = await getSummary(docId, lang);
      setSummary(data.summary);
      setSummaryLang(lang);
    } catch (err) {
      setError("Failed to generate summary in this language. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Clean markdown bold markers from Gemini output
  const cleanSummary = summary ? summary.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1") : "";

  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Case Summary</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {filename} &nbsp;·&nbsp; {pageCount} {pageCount === 1 ? "page" : "pages"}
          </p>
        </div>
      </div>

      {/* Language tabs */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 font-medium mb-2">Summary Language</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLangChange(l.gemini)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${activeLang === l.gemini
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 disabled:opacity-50"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-5">
        <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-3">
          Plain-Language Summary — {activeLang}
        </p>
        {loading ? (
          <Loader text={`Generating summary in ${activeLang}...`} />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : cleanSummary ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{cleanSummary}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Summary not available.</p>
        )}
      </div>

      {/* Grounding note */}
      {!loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6">
          <p className="text-xs text-blue-600">
            This summary was generated strictly from your uploaded document. No outside information was added.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/chat")}
          className="flex-1 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ask Questions
        </button>
        <button
          onClick={() => navigate("/timeline")}
          className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-blue-200 hover:text-blue-500 transition-colors"
        >
          View Timeline
        </button>
      </div>
    </div>
  );
}
