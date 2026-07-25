import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDoc } from "../context/DocContext";

const STEPS = [
  {
    n: "1", title: "Upload Document",
    desc: "Upload a FIR, chargesheet, bail order, or any court document.",
    path: "/upload", cta: "Upload Now", requiresDoc: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    n: "2", title: "Read Case Summary",
    desc: "Get a plain-language summary in Hindi, English, or 5 other Indian languages.",
    path: "/summary", cta: "View Summary", requiresDoc: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    n: "3", title: "Ask Questions",
    desc: "Ask anything about your case. Every answer is cited from your document.",
    path: "/chat", cta: "Ask Questions", requiresDoc: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    n: "4", title: "Predict Timeline",
    desc: "Find out when your next hearing might be based on similar cases.",
    path: "/timeline", cta: "View Timeline", requiresDoc: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { docId, filename, clearDocument } = useDoc();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 max-w-3xl w-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          {greeting}, {user?.name}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {docId ? `Document loaded: ${filename}` : "Start by uploading a court document below."}
        </p>
      </div>

      {/* Active document card */}
      {docId ? (
        <div className="bg-blue-500 rounded-2xl p-6 mb-8 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Active Document</p>
            <p className="text-white font-semibold text-base truncate">{filename}</p>
            <p className="text-blue-200 text-xs mt-0.5">Ready for Q&A and timeline prediction</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate("/chat")}
              className="px-4 py-2 bg-white text-blue-500 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              Ask
            </button>
            <button
              onClick={() => navigate("/summary")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              Summary
            </button>
            <button
              onClick={() => clearDocument()}
              className="px-3 py-2 bg-blue-600 text-blue-200 text-sm rounded-xl hover:bg-blue-700 hover:text-white transition-all"
              title="Clear document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => navigate("/upload")}
          className="border-2 border-dashed border-blue-200 rounded-2xl p-6 mb-8 flex items-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Upload a court document to get started</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, or PNG up to 20 MB</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 transition-colors">
              Upload
            </span>
          </div>
        </div>
      )}

      {/* Steps */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">How it works</p>
      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const locked   = step.requiresDoc && !docId;
          const done     = idx === 0 && docId;

          return (
            <div
              key={step.n}
              onClick={() => !locked && navigate(step.path)}
              className={`flex items-center gap-4 bg-white border rounded-2xl p-4 transition-all
                ${locked
                  ? "opacity-40 cursor-not-allowed border-gray-100"
                  : "border-gray-200 hover:border-blue-200 hover:shadow-sm cursor-pointer active:scale-99"
                }`}
            >
              {/* Step number / icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                ${done ? "bg-green-50 text-green-500" : locked ? "bg-gray-50 text-gray-300" : "bg-blue-50 text-blue-500"}`}>
                {done ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : step.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  {done && <span className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Done</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow */}
              {!locked && (
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-blue-600 leading-relaxed">
          For the best demo results, use a typed PDF of 2 to 5 pages.
          After uploading, summaries are available in 7 languages including Hindi, Kannada, and Tamil.
        </p>
      </div>
    </div>
  );
}
