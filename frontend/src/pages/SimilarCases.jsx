import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { getSimilarCases } from "../services/api";

export default function SimilarCases() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const [results, setResults] = useState(null);
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

  async function handleFind() {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await getSimilarCases(docId, 5);
      setResults(data.similar_cases);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not find similar cases.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Similar Case Finder</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <button onClick={handleFind} disabled={loading}
        className="mb-5 w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
        {loading ? "Searching..." : "Find Similar Cases"}
      </button>

      {loading && <Loader text="Looking for comparable cases..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      <div className="space-y-3">
        {results?.map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.case_title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.court}</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1 rounded-full font-medium shrink-0">
                {c.similarity}% similar
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium capitalize">{c.case_type}</span> — {c.outcome}
            </p>
          </div>
        ))}
      </div>

      {results && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
          <p className="text-xs text-blue-600 leading-relaxed">
            These are illustrative precedents for demo purposes based on the detected case type. Verify against official case-law databases before relying on them.
          </p>
        </div>
      )}
    </div>
  );
}
