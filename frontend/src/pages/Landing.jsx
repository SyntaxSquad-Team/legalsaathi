import React from "react";
import { Link } from "react-router-dom";

const WORKFLOW = [
  { n: "01", title: "Upload your document", body: "FIR, chargesheet, bail order, or hearing order — any court PDF or scan." },
  { n: "02", title: "Get a plain-language summary", body: "In 7 Indian languages, cited straight from your document, with a risk score." },
  { n: "03", title: "Track and prepare", body: "Deadlines, hearing dates, similar precedents, and a first-draft argument, all in one case file." },
  { n: "04", title: "Act with support", body: "Match with a lawyer, share a read-only case link, or export your summary as a PDF." },
];

const FEATURES = [
  {
    group: "Stay ahead of your case",
    items: [
      { title: "Deadline alerts", body: "Never miss a filing window or appeal deadline again." },
      { title: "Case hearing tracker", body: "Every hearing date, court, and outcome in one timeline." },
      { title: "Case risk score", body: "A plain-language read on how urgent your document really is." },
    ],
  },
  {
    group: "Understand where you stand",
    items: [
      { title: "Similar-case finder", body: "See how comparable cases were argued and resolved." },
      { title: "Argument drafter", body: "A grounded first draft of arguments, built only from your document." },
      { title: "Multi-document case linking", body: "Connect the FIR, chargesheet, and orders into one case file." },
    ],
  },
  {
    group: "Get support when you need it",
    items: [
      { title: "Lawyer matching", body: "Matched by case type, city, and experience — with real profiles to book." },
      { title: "Shareable read-only links", body: "Send your case to family or counsel without handing over your account." },
      { title: "Export summary as PDF", body: "A clean, printable summary you can carry into any office." },
    ],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FBF9F5", color: "#12213D" }}>
      {/* Top bar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="font-display text-xl font-semibold tracking-tight">LegalSaathi</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-[#12213D]/70 hover:text-[#12213D] transition-colors px-3 py-2">
            Log in
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium bg-[#12213D] text-white px-4 py-2.5 rounded-lg hover:bg-[#1c3255] transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#B8892F] mb-5">
            For Indian litigants
          </span>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] font-medium mb-6">
            Your court case,
            <br />
            in plain language.
          </h1>
          <p className="text-lg text-[#5B6472] max-w-md mb-8 leading-relaxed">
            Upload any FIR, chargesheet, or hearing order. LegalSaathi summarises it,
            tracks your deadlines and hearings, and helps you find the right lawyer —
            grounded only in what your document says.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="bg-[#3B82F6] text-white font-medium px-6 py-3.5 rounded-lg hover:bg-[#2f6fdb] transition-colors shadow-sm"
            >
              Upload your first document
            </Link>
            <span className="text-sm text-[#5B6472]">No fee to summarise a document.</span>
          </div>
        </div>

        {/* Signature visual: fanned case-file stack with a seal */}
        <div className="relative h-80 hidden md:block" aria-hidden="true">
          <div className="absolute right-8 top-6 w-56 h-72 bg-white border border-[#12213D]/10 rounded-xl shadow-sm rotate-6" />
          <div className="absolute right-16 top-2 w-56 h-72 bg-white border border-[#12213D]/10 rounded-xl shadow-md -rotate-3" />
          <div className="absolute right-24 top-8 w-56 h-72 bg-white border border-[#12213D]/10 rounded-xl shadow-lg p-6 flex flex-col">
            <div className="h-2 w-16 bg-[#3B82F6]/70 rounded-full mb-3" />
            <div className="h-1.5 w-full bg-[#12213D]/10 rounded-full mb-2" />
            <div className="h-1.5 w-4/5 bg-[#12213D]/10 rounded-full mb-2" />
            <div className="h-1.5 w-full bg-[#12213D]/10 rounded-full mb-2" />
            <div className="h-1.5 w-3/5 bg-[#12213D]/10 rounded-full mb-6" />
            <div className="mt-auto flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#5B6472]">Case summary</span>
              <span className="text-[10px] font-semibold text-[#2F6F4F] bg-[#2F6F4F]/10 px-2 py-1 rounded-full">
                Low risk
              </span>
            </div>
          </div>
          <div className="absolute right-2 bottom-4 w-16 h-16 rounded-full bg-[#B8892F] text-white flex items-center justify-center shadow-lg rotate-[-8deg]">
            <span className="font-display text-[10px] leading-tight text-center">AI<br/>Reviewed</span>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-t border-[#12213D]/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-medium mb-10">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {WORKFLOW.map((step) => (
              <div key={step.n}>
                <span className="font-display text-3xl text-[#B8892F]">{step.n}</span>
                <h3 className="font-semibold mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-[#5B6472] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#12213D]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-medium mb-2">Everything your case needs</h2>
          <p className="text-[#5B6472] mb-12">Built for the parts of a case that get lost between hearings.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {FEATURES.map((group) => (
              <div key={group.group}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#B8892F] mb-5">
                  {group.group}
                </h3>
                <div className="space-y-5">
                  {group.items.map((item) => (
                    <div key={item.title} className="border-l-2 border-[#12213D]/10 pl-4">
                      <p className="font-medium text-[#12213D] mb-1">{item.title}</p>
                      <p className="text-sm text-[#5B6472] leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#12213D]/10">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-4xl font-medium mb-4">Bring your case out of the file.</h2>
          <p className="text-[#5B6472] mb-8 max-w-lg mx-auto">
            Upload a document and see your plain-language summary in under a minute.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#12213D] text-white font-medium px-7 py-3.5 rounded-lg hover:bg-[#1c3255] transition-colors"
          >
            Get started for free
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#12213D]/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-[#5B6472]">
          <span>LegalSaathi — built for InnovaHack Chapter 1, Gen AI Track.</span>
          <span>Not a substitute for advice from a licensed advocate.</span>
        </div>
      </footer>
    </div>
  );
}
