import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlanProvider } from "./context/PlanContext";
import { DocProvider } from "./context/DocContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import Chat from "./pages/Chat";
import Timeline from "./pages/Timeline";
import Pricing from "./pages/Pricing";

// Wrap protected pages in this — redirects to login if not signed in
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Main layout with sidebar
function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload"    element={<Upload />} />
          <Route path="/summary"   element={<Summary />} />
          <Route path="/chat"      element={<Chat />} />
          <Route path="/timeline"  element={<Timeline />} />
          <Route path="/pricing"   element={<Pricing />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <DocProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected — everything inside AppLayout */}
              <Route path="/*" element={
                <Protected>
                  <AppLayout />
                </Protected>
              } />
            </Routes>
          </BrowserRouter>
        </DocProvider>
      </PlanProvider>
    </AuthProvider>
  );
}