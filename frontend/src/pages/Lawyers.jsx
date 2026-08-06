import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useDoc } from "../context/DocContext";
import { useAuth } from "../context/AuthContext";
import { listLawyers, matchLawyers, bookLawyer } from "../services/api";

export default function Lawyers() {
  const { docId } = useDoc();
  const { user } = useAuth();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [message, setMessage] = useState("");
  const [bookedIds, setBookedIds] = useState([]);

  useEffect(() => {
    listLawyers().then(setLawyers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleMatch() {
    setMatching(true);
    setError(null);
    try {
      const data = await matchLawyers(docId || null, null, null);
      setLawyers(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not match lawyers.");
    } finally {
      setMatching(false);
    }
  }

  async function handleBook(lawyerId) {
    if (!user) return;
    try {
      await bookLawyer(lawyerId, user.name, user.email, docId || null, message);
      setBookedIds([...bookedIds, lawyerId]);
      setBookingFor(null);
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not send booking request.");
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-gray-800">Lawyer Matching</h1>
        {docId && (
          <button onClick={handleMatch} disabled={matching}
            className="text-xs px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            {matching ? "Matching..." : "Match to my document"}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-6">
        Browse lawyers or match by your uploaded document's case type. You can book multiple lawyers for a consultation.
      </p>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500 mb-4">{error}</div>}
      {loading && <Loader text="Loading lawyer directory..." />}

      <div className="grid sm:grid-cols-2 gap-4">
        {lawyers.map((l) => (
          <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{l.name}</p>
                <p className="text-xs text-blue-500 capitalize font-medium">{l.specialization} law · {l.city}</p>
              </div>
              {l.match_score != null && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium shrink-0">
                  {l.match_score}% match
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{l.bio}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
              <span>{l.experience_years} yrs experience</span>
              <span>{"★".repeat(l.rating)}{"☆".repeat(5 - l.rating)}</span>
              <span>{l.fee_range}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Speaks {l.languages}</p>

            {bookedIds.includes(l.id) ? (
              <div className="mt-3 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 font-medium">
                Booking request sent
              </div>
            ) : bookingFor === l.id ? (
              <div className="mt-3 space-y-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe what you need help with"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleBook(l.id)} disabled={!user}
                    className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    Send request
                  </button>
                  <button onClick={() => setBookingFor(null)}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setBookingFor(l.id)}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 mt-3">
                Book consultation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
