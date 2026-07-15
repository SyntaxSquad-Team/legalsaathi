import React, { useState } from "react";

export default function ChatBubble({ role, text, citations = [] }) {
  const [show, setShow] = useState(false);
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}
        >
          {text}
        </div>
        {!isUser && citations.length > 0 && (
          <button
            onClick={() => setShow(!show)}
            className="text-xs text-blue-500 hover:underline ml-1"
          >
            {show ? "Hide sources" : `View ${citations.length} source${citations.length > 1 ? "s" : ""}`}
          </button>
        )}
        {show && (
          <div className="flex flex-col gap-2 w-full mt-1">
            {citations.map((c, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-500 mb-1">Source — Chunk {c.chunk_index}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{c.source_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
