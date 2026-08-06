import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoc } from "../context/DocContext";
import { createShareLink } from "../services/api";

export default function ShareCase() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const [expiresIn, setExpiresIn] = useState(7);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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

  async function handleCreate() {
    setLoading(true);
    setError(null);
    setLink(null);
    try {
      setLink(await createShareLink(docId, null, Number(expiresIn)));
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create share link.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(link.share_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Shareable Read-Only Link</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <label className="text-xs text-gray-500 font-medium block mb-1">Link expires in</label>
        <select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white mb-4">
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={0}>Never</option>
        </select>
        <button onClick={handleCreate} disabled={loading}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? "Creating..." : "Create Share Link"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      {link && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium mb-2">Share this link — it's read-only, no login required:</p>
          <div className="flex items-center gap-2">
            <input readOnly value={link.share_url}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 bg-gray-50" />
            <button onClick={handleCopy}
              className="text-xs px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shrink-0">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {link.expires_at && <p className="text-xs text-gray-400 mt-2">Expires on {link.expires_at}</p>}
        </div>
      )}
    </div>
  );
}
