import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { createCase, listCases, linkDocumentToCase, unlinkDocumentFromCase } from "../services/api";

export default function CaseLinks() {
  const { docId, filename } = useDoc();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setCases(await listCases());
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not load cases.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title) return;
    setCreating(true);
    setError(null);
    try {
      await createCase(title, description, docId ? [docId] : []);
      setTitle(""); setDescription("");
      refresh();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create case.");
    } finally {
      setCreating(false);
    }
  }

  async function handleLinkCurrent(caseId) {
    if (!docId) return;
    await linkDocumentToCase(caseId, docId);
    refresh();
  }

  async function handleUnlink(caseId, dId) {
    await unlinkDocumentFromCase(caseId, dId);
    refresh();
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Multi-Document Case Linking</h1>
      <p className="text-xs text-gray-400 mb-6">
        {docId ? `Active document: ${filename}` : "No document loaded — you can still browse and create cases."}
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="mb-4">
          <label className="text-xs text-gray-500 font-medium block mb-1">Case title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. State vs. Sharma — FIR 221/2026"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500 font-medium block mb-1">Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Short note about this matter"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        </div>
        <button onClick={handleCreate} disabled={creating || !title}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
          {creating ? "Creating..." : docId ? "Create Case with current document" : "Create Case"}
        </button>
      </div>

      {loading && <Loader text="Loading cases..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.case_id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
              </div>
              <span className="text-xs text-gray-400 shrink-0">{c.doc_ids.length} doc{c.doc_ids.length === 1 ? "" : "s"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {c.doc_ids.map((dId) => (
                <span key={dId} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1.5">
                  {dId === docId ? filename : dId.slice(0, 8)}
                  <button onClick={() => handleUnlink(c.case_id, dId)} className="text-gray-300 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            {docId && !c.doc_ids.includes(docId) && (
              <button onClick={() => handleLinkCurrent(c.case_id)}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 mt-3">
                Link current document
              </button>
            )}
          </div>
        ))}
        {!loading && cases.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 leading-relaxed">
              No cases yet. Create one to link related documents together, e.g. the FIR, chargesheet, and bail order for the same matter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
