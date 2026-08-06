import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { getRiskScore } from "../services/api";

export default function RiskScore() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const [result, setResult] = useState(null);
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

  async function handleCompute() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await getRiskScore(docId));
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not compute risk score.");
    } finally {
      setLoading(false);
    }
  }

  const levelColor = {
    Low: "text-green-600 bg-green-50 border-green-200",
    Medium: "text-amber-600 bg-amber-50 border-amber-200",
    High: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Case Risk Score</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <button onClick={handleCompute} disabled={loading}
        className="mb-5 w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
        {loading ? "Analysing document..." : "Compute Risk Score"}
      </button>

      {loading && <Loader text="Scanning document for risk indicators..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      {result && (
        <div className={`border rounded-xl p-6 shadow-sm ${levelColor[result.risk_level] || "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">{result.risk_level} Risk</span>
            <span className="text-3xl font-bold">{result.risk_score}<span className="text-base font-normal">/100</span></span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-2 mb-4 overflow-hidden">
            <div className="h-2 rounded-full bg-current" style={{ width: `${result.risk_score}%` }} />
          </div>
          <p className="text-xs font-semibold mb-2 opacity-80">Why this score:</p>
          <ul className="text-xs space-y-1.5 opacity-90 mb-4">
            {result.factors.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
          <p className="text-xs opacity-70">{result.message}</p>
        </div>
      )}
    </div>
  );
}
