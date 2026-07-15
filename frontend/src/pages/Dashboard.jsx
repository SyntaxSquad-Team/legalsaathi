import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDoc } from "../context/DocContext";

const STEPS = [
  { n: "1", title: "Upload Document", desc: "Upload any court document — FIR, chargesheet, bail order, hearing order.", path: "/upload", cta: "Upload Now", requiresDoc: false },
  { n: "2", title: "Read Case Summary", desc: "Get a plain-language summary of your case in Hindi, English, or your regional language.", path: "/summary", cta: "View Summary", requiresDoc: true },
  { n: "3", title: "Ask Questions", desc: "Ask anything about your case. Answers come directly from your uploaded document.", path: "/chat", cta: "Ask Questions", requiresDoc: true },
  { n: "4", title: "Predict Timeline", desc: "Find out when your next hearing might be and how long the case could take.", path: "/timeline", cta: "View Timeline", requiresDoc: true },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { docId, filename } = useDoc();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 max-w-3xl">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          {greeting}, {user?.name || "there"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {docId
            ? `Document loaded: ${filename}`
            : "No document loaded yet. Start by uploading a court document."}
        </p>
      </div>

      {/* Active doc card */}
      {docId && (
        <div className="bg-blue-500 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">Active Document</p>
            <p className="text-white font-semibold">{filename}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/summary")}
              className="px-4 py-2 bg-white text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Summary
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ask Questions
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="grid grid-cols-1 gap-4">
        {STEPS.map((step) => {
          const locked = step.requiresDoc && !docId;
          return (
            <div
              key={step.n}
              className={`bg-white border rounded-xl p-5 flex items-center gap-5
                ${locked ? "opacity-50" : "border-gray-200 hover:border-blue-200 transition-colors"}`}
            >
              {/* Step number */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
                ${locked ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-500"}`}>
                {step.n}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>

              {/* CTA */}
              <button
                disabled={locked}
                onClick={() => !locked && navigate(step.path)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0
                  ${locked
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                {locked ? "Upload first" : step.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick tip */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-medium text-blue-500 mb-1">Quick tip</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          For the best results, upload a PDF that is 2 to 5 pages. Typed documents work faster than scanned ones.
          After uploading, the summary is available in 7 languages.
        </p>
      </div>
    </div>
  );
}
