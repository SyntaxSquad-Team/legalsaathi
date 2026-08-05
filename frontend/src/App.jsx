import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlanProvider } from "./context/PlanContext";
import { DocProvider } from "./context/DocContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import Chat from "./pages/Chat";
import Timeline from "./pages/Timeline";
import Pricing from "./pages/Pricing";
import Deadlines from "./pages/Deadlines";
import Hearings from "./pages/Hearings";
import CaseLinks from "./pages/CaseLinks";
import Lawyers from "./pages/Lawyers";
import RiskScore from "./pages/RiskScore";
import SimilarCases from "./pages/SimilarCases";
import ShareCase from "./pages/ShareCase";
import SharedView from "./pages/SharedView";
import ArgumentDrafter from "./pages/ArgumentDrafter";
import History from "./pages/History";

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
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/hearings"  element={<Hearings />} />
          <Route path="/cases"     element={<CaseLinks />} />
          <Route path="/lawyers"   element={<Lawyers />} />
          <Route path="/risk-score" element={<RiskScore />} />
          <Route path="/similar-cases" element={<SimilarCases />} />
          <Route path="/share"     element={<ShareCase />} />
          <Route path="/argument-drafter" element={<ArgumentDrafter />} />
          <Route path="/history"   element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

// Root route: show the public landing page to signed-out visitors,
// send signed-in users straight to their dashboard.
function Root() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <DocProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Root />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/shared/:token" element={<SharedView />} />

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