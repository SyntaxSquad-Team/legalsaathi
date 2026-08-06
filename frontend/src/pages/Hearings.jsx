import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { addHearing, listHearings, updateHearing, deleteHearing } from "../services/api";

export default function Hearings() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();

  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [hearingDate, setHearingDate] = useState("");
  const [courtName, setCourtName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);
  const [outcomeDraft, setOutcomeDraft] = useState({});

  useEffect(() => {
    if (docId) refresh();
  }, [docId]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setHearings(await listHearings(docId));
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not load hearings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!hearingDate) return;
    setSaving(true);
    setError(null);
    try {
      await addHearing(docId, hearingDate, courtName, purpose);
      setHearingDate(""); setCourtName(""); setPurpose("");
      refresh();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not add hearing.");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(id) {
    await updateHearing(id, { status: "completed", outcome: outcomeDraft[id] || "" });
    refresh();
  }

  async function handleAdjourn(id) {
    await updateHearing(id, { status: "adjourned", outcome: outcomeDraft[id] || "" });
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

  const statusStyle = {
    upcoming: "bg-blue-50 text-blue-500",
    completed: "bg-green-50 text-green-600",
    adjourned: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Case Hearing Tracker</h1>
      <p className="text-xs text-gray-400 mb-6">{filename}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Hearing date</label>
            <input type="date" value={hearingDate} onChange={(e) => setHearingDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Court</label>
            <input value={courtName} onChange={(e) => setCourtName(e.target.value)}
              placeholder="e.g. District Court, Pune"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">Purpose</label>
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Framing of charges, evidence hearing"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <button onClick={handleAdd} disabled={saving || !hearingDate}
          className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
          {saving ? "Adding..." : "Add Hearing"}
        </button>
      </div>

      {loading && <Loader text="Loading hearing history..." />}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}

      <div className="space-y-3">
        {hearings.map((h) => (
          <div key={h.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">{h.hearing_date}</p>
                <p className="text-xs text-gray-500 mt-0.5">{h.court_name || "Court not specified"}</p>
                {h.purpose && <p className="text-xs text-gray-400 mt-0.5">{h.purpose}</p>}
                {h.outcome && <p className="text-xs text-gray-600 mt-1 italic">"{h.outcome}"</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${statusStyle[h.status] || "bg-gray-50 text-gray-500"}`}>
                {h.status}
              </span>
            </div>
            {h.status === "upcoming" && (
              <div className="mt-3 space-y-2">
                <input
                  placeholder="Outcome / next steps (optional)"
                  value={outcomeDraft[h.id] || ""}
                  onChange={(e) => setOutcomeDraft({ ...outcomeDraft, [h.id]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleComplete(h.id)}
                    className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Mark completed</button>
                  <button onClick={() => handleAdjourn(h.id)}
                    className="text-xs px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100">Mark adjourned</button>
                  <button onClick={() => deleteHearing(h.id).then(refresh)}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">Remove</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && hearings.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 leading-relaxed">No hearings tracked yet for this document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
