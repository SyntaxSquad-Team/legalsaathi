import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewSharedLink } from "../services/api";

export default function SharedView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    viewSharedLink(token)
      .then(setData)
      .catch((err) => setError(err?.response?.data?.detail || "This link could not be loaded."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-blue-500 font-bold text-lg tracking-tight">LegalSaathi</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Read-only shared view</span>
        </div>

        {loading && <p className="text-sm text-gray-400">Loading shared case...</p>}
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-500">{error}</div>}

        {data?.type === "document" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">{data.filename}</h1>
            <p className="text-xs text-gray-400 mb-4">{data.page_count} pages · viewed {data.view_count} time(s)</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{data.extracted_text}</p>
          </div>
        )}

        {data?.type === "case" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">Case {data.case_id}</h1>
            <p className="text-xs text-gray-400 mb-4">{data.documents.length} document(s) · viewed {data.view_count} time(s)</p>
            <div className="space-y-2">
              {data.documents.map((d) => (
                <div key={d.doc_id} className="border border-gray-100 rounded-lg px-3 py-2">
                  <p className="text-sm font-medium text-gray-700">{d.filename}</p>
                  <p className="text-xs text-gray-400">{d.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
