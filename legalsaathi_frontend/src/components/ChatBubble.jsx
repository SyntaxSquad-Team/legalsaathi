import React, { useState } from "react";

export default function ChatBubble({ role, text, citations = [] }) {
  const [showCitations, setShowCitations] = useState(false);
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? "bg-primary-500 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
            }`}
        >
          {text}
        </div>

        {/* Citations toggle — only for AI responses */}
        {!isUser && citations.length > 0 && (
          <button
            onClick={() => setShowCitations(!showCitations)}
            className="text-xs text-primary-500 hover:underline ml-1"
          >
            {showCitations ? "Hide sources" : `View ${citations.length} source${citations.length > 1 ? "s" : ""}`}
          </button>
        )}

        {/* Citation blocks */}
        {showCitations && (
          <div className="mt-1 flex flex-col gap-2 w-full">
            {citations.map((c, i) => (
              <div key={i} className="bg-primary-50 border border-primary-100 rounded p-2">
                <p className="text-xs text-primary-500 font-medium mb-0.5">
                  Source — Chunk {c.chunk_index}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {c.source_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
