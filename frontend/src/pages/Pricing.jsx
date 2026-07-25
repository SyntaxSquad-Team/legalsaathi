import React, { useState } from "react";
import { usePlan } from "../context/PlanContext";
import UpgradeModal from "../components/UpgradeModal";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Try LegalSaathi with basic access",
    features: [
      "3 document uploads / month",
      "Plain-language summary (English only)",
      "Basic hearing timeline",
      "Community support",
    ],
    cta: "Current plan for new users",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/ month",
    description: "For individual litigants handling active cases",
    features: [
      "Unlimited document uploads",
      "Summaries in 7 Indian languages",
      "Ask questions, get cited answers",
      "Hearing date prediction",
      "Priority email support",
    ],
    highlight: true,
    cta: "Upgrade to Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,999",
    period: "/ month",
    description: "For law firms and legal aid organizations",
    features: [
      "Everything in Pro",
      "Multi-user case workspaces",
      "Dedicated onboarding",
      "API access",
      "SLA-backed support",
    ],
    cta: "Upgrade to Enterprise",
  },
];

export default function Pricing() {
  const { plan } = usePlan();
  const [selectedTier, setSelectedTier] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Plans for every litigant</h1>
        <p className="text-sm text-gray-400">Simple pricing. Upgrade or downgrade anytime.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isCurrent = plan === tier.id;
          return (
            <div
              key={tier.id}
              className={`rounded-2xl border p-8 flex flex-col bg-white ${
                tier.highlight ? "border-blue-500 shadow-lg relative" : "border-gray-200"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-8 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-800">{tier.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">{tier.price}</span>
                <span className="text-sm text-gray-400"> {tier.period}</span>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <button disabled className="w-full py-3 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-default">
                  Current Plan
                </button>
              ) : tier.id === "free" ? (
                <button disabled className="w-full py-3 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-default">
                  {tier.cta}
                </button>
              ) : (
                <button
                  onClick={() => setSelectedTier(tier)}
                  className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
                >
                  {tier.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedTier && (
        <UpgradeModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
      )}
    </div>
  );
}