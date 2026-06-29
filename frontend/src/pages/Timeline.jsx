import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimelineCard from "../components/TimelineCard";
import Loader from "../components/Loader";
import { getTimeline } from "../services/api";
import { useDoc } from "../context/DocContext";

const CASE_TYPES = ["civil", "criminal", "family", "consumer", "labour"];

export default function Timeline() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();

  const [caseType, setCaseType]   = useState("civil");
  const [courtName, setCourtName] = useState("District Court");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  if (!docId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500 text-sm">No document loaded.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600"
        >
          Upload a Document
        </button>
      </div>
    );
  }

  async function handlePredict() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await getTimeline(docId, caseType, courtName);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Timeline prediction failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      <h1 className="text-xl font-semibold text-gray-800 mb-1">Timeline Prediction</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Case Type</label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-500"
            >
              {CASE_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Court Name</label>
            <input
              type="text"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              placeholder="e.g. District Court, Bengaluru"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-2.5 bg-primary-500 text-white text-sm font-medium rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict Timeline"}
        </button>
      </div>

      {/* Loading */}
      {loading && <Loader text="Analysing similar cases from eCourts..." />}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Result */}
      {result && <TimelineCard data={result} />}

      {/* Info note */}
      {!result && !loading && (
        <div className="bg-primary-50 border border-primary-100 rounded p-4">
          <p className="text-xs text-primary-600 leading-relaxed">
            Select the case type and court name above, then click Predict Timeline.
            The prediction is based on similar resolved cases from the eCourts database.
          </p>
        </div>
      )}
    </div>
  );
}
