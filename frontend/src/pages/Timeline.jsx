import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimelineCard from "../components/TimelineCard";
import Loader from "../components/Loader";
import { getTimeline } from "../services/api";
import { useDoc } from "../context/DocContext";
import { usePlan } from "../context/PlanContext";

const CASE_TYPES = ["civil", "criminal", "family", "consumer", "labour"];

export default function Timeline() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const { limits } = usePlan();

  const [caseType, setCaseType]   = useState("civil");
  const [courtName, setCourtName] = useState("District Court");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  if (!limits.timelineAccess) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Timeline Prediction is a Pro feature</p>
        <p className="text-gray-400 text-sm mb-4">Upgrade your plan to predict hearing timelines for your case.</p>
        <button onClick={() => navigate("/pricing")}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
          View Plans
        </button>
      </div>
    );
  }

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

  async function handlePredict() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await getTimeline(docId, caseType, courtName);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Timeline Prediction</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Case Type</label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white capitalize"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict Timeline"}
        </button>
      </div>

      {loading && <Loader text="Analysing similar cases from eCourts..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}
      {result && <TimelineCard data={result} />}

      {!result && !loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 leading-relaxed">
            Select the case type and court name, then click Predict Timeline.
            The prediction is based on similar resolved cases from the eCourts database.
          </p>
        </div>
      )}
    </div>
  );
}