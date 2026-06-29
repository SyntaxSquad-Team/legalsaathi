import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocProvider } from "./context/DocContext";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import Chat from "./pages/Chat";
import Timeline from "./pages/Timeline";

export default function App() {
  return (
    <DocProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Upload />} />
          <Route path="/summary"  element={<Summary />} />
          <Route path="/chat"     element={<Chat />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </BrowserRouter>
    </DocProvider>
  );
}
