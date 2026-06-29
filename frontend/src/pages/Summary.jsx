import React from "react";
import { useNavigate } from "react-router-dom";
import { useDoc } from "../context/DocContext";

export default function Summary() {
  const navigate = useNavigate();
  const { docId, filename, summary, pageCount, clearDocument } = useDoc();

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

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Document info bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Case Summary</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {filename} &nbsp;·&nbsp; {pageCount} {pageCount === 1 ? "page" : "pages"}
          </p>
        </div>
        <button
          onClick={() => { clearDocument(); navigate("/"); }}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          Clear document
        </button>
      </div>

      {/* Summary card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
        <p className="text-xs text-primary-500 font-medium uppercase tracking-wide mb-3">
          Plain-Language Summary
        </p>
        {summary ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Summary not available.</p>
        )}
      </div>

      {/* Note about grounding */}
      <div className="bg-primary-50 border border-primary-100 rounded p-3 mb-8">
        <p className="text-xs text-primary-600">
          This summary was generated strictly from your uploaded document. No information was added from outside sources.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/chat")}
          className="flex-1 py-2.5 bg-primary-500 text-white text-sm font-medium rounded hover:bg-primary-600 transition-colors"
        >
          Ask Questions
        </button>
        <button
          onClick={() => navigate("/timeline")}
          className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded hover:border-primary-200 hover:text-primary-500 transition-colors"
        >
          View Timeline
        </button>
      </div>
    </div>
  );
}
