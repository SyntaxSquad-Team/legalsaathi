import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { getDocumentHistory } from "../services/api";

export default function History() {
  const { setDocument } = useDoc();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDocumentHistory()
      .then(setItems)
      .catch((err) => setError(err?.response?.data?.detail || "Could not load history."))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    ready: "bg-green-50 text-green-600",
    processing: "bg-blue-50 text-blue-500",
    failed: "bg-red-50 text-red-500",
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Document History</h1>
      <p className="text-xs text-gray-400 mb-6">Every document you've uploaded, most recent first.</p>

      {loading && <Loader text="Loading history..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      <div className="space-y-3">
        {items.map((d) => (
          <div key={d.doc_id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{d.filename}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {d.page_count} pages · uploaded {d.created_at} · {d.qa_count} question{d.qa_count === 1 ? "" : "s"} asked
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[d.status] || "bg-gray-50 text-gray-500"}`}>
                {d.status}
              </span>
              <button
                onClick={() => setDocument({ doc_id: d.doc_id, filename: d.filename, page_count: d.page_count })}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100"
              >
                Reopen
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 leading-relaxed">No documents uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
