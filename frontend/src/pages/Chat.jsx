import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import Loader from "../components/Loader";
import { askQuestion } from "../services/api";
import { useDoc } from "../context/DocContext";
import { usePlan } from "../context/PlanContext";

const SUGGESTED = [
  "What is this case about?",
  "Who are the parties involved?",
  "What documents do I need for the next hearing?",
  "What orders have been passed so far?",
  "What arguments can be made in my favour?",
];

export default function Chat() {
  const navigate = useNavigate();
  const { docId, filename } = useDoc();
  const { limits } = usePlan();

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!limits.chatAccess) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Ask Questions is a Pro feature</p>
        <p className="text-gray-400 text-sm mb-4">Upgrade your plan to ask questions about your case documents.</p>
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

  async function handleSend(question) {
    const q = (question || input).trim();
    if (!q || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: q, citations: [] }]);
    setLoading(true);
    try {
      const data = await askQuestion(docId, q);
      setMessages((prev) => [...prev, { role: "ai", text: data.answer, citations: data.citations || [] }]);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to get an answer. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] p-6 max-w-2xl">

      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-semibold text-gray-800">Ask About Your Case</h1>
        <p className="text-xs text-gray-400 mt-0.5">{filename}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-1">
        {messages.length === 0 && !loading && (
          <div>
            <p className="text-xs text-gray-400 mb-3">Try asking:</p>
            <div className="flex flex-col gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-left text-sm text-blue-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} citations={m.citations} />
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
              <Loader text="Searching document..." />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-500 mb-4">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 shrink-0">
        <div className="flex gap-2 items-end border border-gray-200 rounded-xl bg-white p-2 shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={1}
            placeholder="Ask a question about your case..."
            disabled={loading}
            className="flex-1 resize-none text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent px-2 py-1"
            style={{ maxHeight: "100px", overflowY: "auto" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Answers are generated strictly from your uploaded document.
        </p>
      </div>
    </div>
  );
}
