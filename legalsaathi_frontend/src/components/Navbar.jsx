import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDoc } from "../context/DocContext";

const tabs = [
  { label: "Upload",   path: "/" },
  { label: "Summary",  path: "/summary" },
  { label: "Ask",      path: "/chat" },
  { label: "Timeline", path: "/timeline" },
];

export default function Navbar() {
  const location = useLocation();
  const { docId } = useDoc();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary-500 font-bold text-lg tracking-tight">
            LegalSaathi
          </span>
        </Link>

        {/* Nav tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const isDisabled = tab.path !== "/" && !docId;
            return (
              <Link
                key={tab.path}
                to={isDisabled ? "#" : tab.path}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-primary-50 text-primary-500"
                    : isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-primary-500 hover:bg-primary-50"
                  }`}
                onClick={(e) => isDisabled && e.preventDefault()}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Doc badge */}
        {docId && (
          <span className="text-xs text-primary-500 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 truncate max-w-[180px]">
            Doc loaded
          </span>
        )}
      </div>
    </nav>
  );
}
