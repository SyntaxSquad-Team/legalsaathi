import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [mode, setMode]         = useState("login");   // "login" | "signup"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your name.");
      return;
    }

    // Simple local auth — no real backend needed for hackathon
    const displayName = mode === "signup" ? name : email.split("@")[0];
    login(displayName, email);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden md:flex w-2/5 bg-blue-500 flex-col justify-between p-10">
        <div>
          <h1 className="text-white font-bold text-2xl">LegalSaathi</h1>
          <p className="text-blue-100 text-sm mt-1">AI Legal Assistant</p>
        </div>
        <div>
          <p className="text-white text-2xl font-semibold leading-snug">
            Justice should not have a price tag.
          </p>
          <p className="text-blue-200 text-sm mt-3 leading-relaxed">
            Upload your court documents. Get a plain-language summary. Ask questions about your case.
            Understand your rights — in your language.
          </p>
        </div>
        <p className="text-blue-300 text-xs">InnovaHack Chapter 1 — Gen AI Track</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-sm">

          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {mode === "login" ? "Sign in to continue" : "Sign up to get started"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "signup" && (
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
              className="text-blue-500 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
