import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDoc } from "../context/DocContext";
import { useAuth } from "../context/AuthContext";
import { usePlan } from "../context/PlanContext";
import PlanBadge from "./PlanBadge";

const NAV = [
  {
    path: "/dashboard", label: "Dashboard", requiresDoc: false, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    path: "/upload", label: "Upload Document", requiresDoc: false, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  },
  {
    path: "/summary", label: "Case Summary", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    path: "/chat", label: "Ask Questions", requiresDoc: true, requiresPlan: "chatAccess",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  },
  {
    path: "/timeline", label: "Timeline", requiresDoc: true, requiresPlan: "timelineAccess",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    path: "/deadlines", label: "Deadline Alerts", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>,
  },
  {
    path: "/hearings", label: "Hearing Tracker", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
  {
    path: "/risk-score", label: "Risk Score", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
  {
    path: "/similar-cases", label: "Similar Cases", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>,
  },
  {
    path: "/argument-drafter", label: "Argument Drafter", requiresDoc: true, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
  {
    path: "/lawyers", label: "Find a Lawyer", requiresDoc: false, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    path: "/history", label: "Document History", requiresDoc: false, requiresPlan: null,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

export default function Navbar() {
  const { docId, filename, clearDocument } = useDoc();
  const { user, logout } = useAuth();
  const { limits } = usePlan();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearDocument();
    logout();
    navigate("/login");
  }

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-200 shrink-0 ${collapsed ? "w-16" : "w-56"}`}
      style={{ minHeight: "100vh" }}>

      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
        {!collapsed && (
          <span className="text-blue-500 font-bold text-base tracking-tight">LegalSaathi</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors ${collapsed ? "mx-auto" : "ml-auto"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Plan badge */}
      <div className={`px-3 pt-3 ${collapsed ? "flex justify-center" : ""}`}>
        <PlanBadge collapsed={collapsed} />
      </div>

      {/* Active doc chip */}
      {!collapsed && docId && (
        <div className="mx-3 mt-3 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs font-medium text-blue-500 truncate">{filename}</p>
          <button
            onClick={() => { clearDocument(); navigate("/upload"); }}
            className="text-xs text-gray-400 hover:text-red-400 mt-0.5 transition-colors"
          >
            Clear document
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map((item) => {
          const docLocked  = item.requiresDoc && !docId;
          const planLocked = item.requiresPlan && !limits[item.requiresPlan];
          const locked     = docLocked || planLocked;
          const isActive   = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={locked ? "#" : item.path}
              onClick={(e) => {
                if (planLocked) {
                  e.preventDefault();
                  navigate("/pricing");
                  return;
                }
                if (locked) e.preventDefault();
              }}
              title={collapsed ? item.label : undefined}
              className={() =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive && !locked
                  ? "bg-blue-500 text-white shadow-sm"
                  : locked
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {planLocked && (
                    <span className="text-xs bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-md shrink-0">
                      Pro
                    </span>
                  )}
                  {!planLocked && docLocked && (
                    <span className="text-xs bg-gray-100 text-gray-300 px-1.5 py-0.5 rounded-md shrink-0">
                      locked
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-100 p-3">
        {!collapsed && user && (
          <div className="px-2 pb-2">
            <p className="text-xs font-semibold text-gray-700 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-500
            hover:bg-red-50 hover:text-red-500 transition-all ${collapsed ? "justify-center" : ""}`}
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