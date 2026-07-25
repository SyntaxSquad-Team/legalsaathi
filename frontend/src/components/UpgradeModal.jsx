import React, { useState } from "react";
import { usePlan } from "../context/PlanContext";

export default function UpgradeModal({ tier, onClose }) {
  const { upgrade } = usePlan();
  const [step, setStep] = useState("form"); // form | processing | success | error
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);

  function handlePay(e) {
    e.preventDefault();
    setError(null);

    if (!card.trim() || !expiry.trim() || !cvv.trim()) {
      setError("Please fill in all payment fields.");
      return;
    }

    setStep("processing");

    setTimeout(() => {
      const result = upgrade(tier.id);
      if (!result.success) {
        setError(result.error);
        setStep("error");
        return;
      }
      setStep("success");
    }, 1200);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm">
          ✕
        </button>

        {step === "form" && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Upgrade to {tier.name}</h3>
            <p className="text-xs text-gray-400 mb-6">
              {tier.price} {tier.period} — simulated payment, no real charge
            </p>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all mt-1"
              >
                Pay {tier.price}
              </button>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Processing payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">You're on {tier.name}</h3>
            <p className="text-xs text-gray-400 mb-6">Your plan has been upgraded.</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={() => setStep("form")}
              className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}