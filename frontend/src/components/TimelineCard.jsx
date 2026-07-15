import React from "react";

const badge = {
  high:   "text-green-600 bg-green-50 border-green-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  low:    "text-red-500   bg-red-50   border-red-200",
};

export default function TimelineCard({ data }) {
  const { predicted_next_hearing, estimated_duration_months, confidence, based_on_cases } = data;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Predicted Next Hearing</p>
          <p className="text-2xl font-semibold text-blue-500">{predicted_next_hearing}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Estimated Duration</p>
          <p className="text-2xl font-semibold text-gray-800">{estimated_duration_months} months</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Confidence</p>
          <span className={`text-xs font-medium px-2.5 py-1 rounded border capitalize ${badge[confidence] || badge.low}`}>
            {confidence}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Based On</p>
          <p className="text-sm text-gray-700">
            {based_on_cases > 0 ? `${based_on_cases} similar cases` : "Limited data"}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
        Based on eCourts historical data. Actual dates may vary.
      </p>
    </div>
  );
}
