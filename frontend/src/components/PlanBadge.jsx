import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "../context/PlanContext";

const BADGE_STYLES = {
  free: "bg-gray-100 text-gray-500",
  pro: "bg-blue-50 text-blue-600",
  enterprise: "bg-purple-50 text-purple-600",
};

export default function PlanBadge({ collapsed }) {
  const { plan, limits } = usePlan();
  const navigate = useNavigate();

  if (collapsed) {
    return (
      <button
        onClick={() => navigate("/pricing")}
        title={`${limits.label} Plan — click to view plans`}
        className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs font-bold ${BADGE_STYLES[plan] || BADGE_STYLES.free} hover:opacity-80 transition-opacity`}
      >
        {limits.label.charAt(0)}
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate("/pricing")}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${BADGE_STYLES[plan] || BADGE_STYLES.free} hover:opacity-80 transition-opacity`}
      title="Click to view plans"
    >
      {limits.label} Plan
    </button>
  );
}