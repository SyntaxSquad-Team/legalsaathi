import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDoc } from "../context/DocContext";
import { useAuth } from "../context/AuthContext";

const NAV = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    requiresDoc: false,
  },
  {
    path: "/upload",
    label: "Upload Document",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    requiresDoc: false,
  },
  {
    path: "/summary",
    label: "Case Summary",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    requiresDoc: true,
  },
  {
    path: "/chat",
    label: "Ask Questions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    requiresDoc: true,
  },
  {
    path: "/timeline",
    label: "Timeline",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    requiresDoc: true,
  },
];

export default function Navbar() {
  const { docId, filename, clearDocument } = useDoc();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearDocument();
    logout();
    navigate("/login");
  }

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${collapsed ? "w-16" : "w-56"} min-h-screen`}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        {!collapsed && (
          <span className="text-blue-500 font-bold text-base tracking-tight">LegalSaathi</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors ml-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Doc status strip */}
      {!collapsed && docId && (
        <div className="mx-3 mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-500 font-medium truncate">{filename}</p>
          <button
            onClick={() => { clearDocument(); navigate("/upload"); }}
            className="text-xs text-gray-400 hover:text-red-400 mt-0.5"
          >
            Clear document
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV.map((item) => {
          const disabled = item.requiresDoc && !docId;
          return (
            <NavLink
              key={item.path}
              to={disabled ? "#" : item.path}
              onClick={(e) => disabled && e.preventDefault()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive && !disabled
                  ? "bg-blue-500 text-white"
                  : disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
              {!collapsed && disabled && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                  Upload first
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 px-3 py-3">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-gray-700 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
