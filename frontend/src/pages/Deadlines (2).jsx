import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { createDeadline, listDeadlines, updateDeadlineStatus, deleteDeadline } from "../services/api";

export default function Deadlines() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();

  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (docId) refresh();
  }, [docId]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDeadlines(docId);
      setDeadlines(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not load deadlines.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!title || !dueDate) return;
    setSaving(true);
    setError(null);
    try {
      await createDeadline(docId, title, description, dueDate);
      setTitle(""); setDescription(""); setDueDate("");
      refresh();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not add deadline.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id, status) {
    await updateDeadlineStatus(id, status);
    refresh();
  }

  async function handleDelete(id) {
    await deleteDeadline(id);
    refresh();
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

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Deadline Alerts</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. File written statement"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">Notes (optional)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Any context for this deadline"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <button onClick={handleAdd} disabled={saving || !title || !dueDate}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
          {saving ? "Adding..." : "Add Deadline"}
        </button>
      </div>

      {loading && <Loader text="Loading deadlines..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      <div className="space-y-3">
        {deadlines.map((d) => {
          const urgent = d.status === "pending" && d.days_remaining <= 3;
          return (
            <div key={d.id} className={`bg-white border rounded-xl p-4 shadow-sm ${urgent ? "border-red-200" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.title}</p>
                  {d.description && <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Due {d.due_date}
                    {d.status === "pending" && (
                      <span className={`ml-2 font-medium ${urgent ? "text-red-500" : "text-blue-500"}`}>
                        {d.days_remaining >= 0 ? `${d.days_remaining} days left` : `${Math.abs(d.days_remaining)} days overdue`}
                      </span>
                    )}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                  d.status === "done" ? "bg-green-50 text-green-600" :
                  d.status === "missed" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                }`}>{d.status}</span>
              </div>
              {d.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleStatus(d.id, "done")}
                    className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Mark done</button>
                  <button onClick={() => handleDelete(d.id)}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">Remove</button>
                </div>
              )}
            </div>
          );
        })}
        {!loading && deadlines.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 leading-relaxed">No deadlines added yet for this document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
