import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import Loader from "../components/Loader";
import { askQuestion } from "../services/api";
import { useDoc } from "../context/DocContext";

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

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const bottomRef                 = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  async function handleSend(question) {
    const q = (question || input).trim();
    if (!q) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: q, citations: [] }]);
    setLoading(true);

    try {
      const data = await askQuestion(docId, q);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, citations: data.citations || [] },
      ]);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to get an answer. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 flex flex-col h-[calc(100vh-56px)]">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Ask About Your Case</h1>
        <p className="text-xs text-gray-400 mt-0.5">{filename}</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pr-1">

        {/* Empty state with suggestions */}
        {messages.length === 0 && !loading && (
          <div>
            <p className="text-xs text-gray-400 mb-3">Try asking:</p>
            <div className="flex flex-col gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm text-primary-500 bg-primary-50 border border-primary-100 rounded px-4 py-2.5 hover:bg-primary-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            text={msg.text}
            citations={msg.citations}
          />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <Loader text="Searching document..." />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-600 mb-4">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="mt-4 flex gap-2 items-end border border-gray-200 rounded-lg bg-white p-2 shadow-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask a question about your case..."
          disabled={loading}
          className="flex-1 resize-none text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent px-2 py-1"
          style={{ maxHeight: "120px", overflowY: "auto" }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Answers are generated strictly from your uploaded document.
      </p>
    </div>
  );
}
