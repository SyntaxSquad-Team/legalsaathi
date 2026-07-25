import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PlanContext = createContext(null);

const PLAN_LIMITS = {
  free: {
    label: "Free",
    maxUploads: 3,
    chatAccess: false,
    timelineAccess: false,
    languages: 1,
  },
  pro: {
    label: "Pro",
    maxUploads: Infinity,
    chatAccess: true,
    timelineAccess: true,
    languages: 7,
  },
  enterprise: {
    label: "Enterprise",
    maxUploads: Infinity,
    chatAccess: true,
    timelineAccess: true,
    languages: 7,
  },
};

export function PlanProvider({ children }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState("free");
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    if (!user?.email) {
      setPlan("free");
      setUploadCount(0);
      return;
    }
    try {
      const savedPlan = localStorage.getItem(`ls_plan_${user.email}`);
      setPlan(savedPlan || "free");

      const savedCount = localStorage.getItem(`ls_upload_count_${user.email}`);
      setUploadCount(savedCount ? parseInt(savedCount, 10) : 0);
    } catch {
      setPlan("free");
      setUploadCount(0);
    }
  }, [user]);

  function upgrade(planId) {
    if (!user?.email) {
      return { success: false, error: "You must be signed in to upgrade." };
    }
    if (!PLAN_LIMITS[planId]) {
      return { success: false, error: "Invalid plan." };
    }
    localStorage.setItem(`ls_plan_${user.email}`, planId);
    setPlan(planId);
    return { success: true };
  }

  function recordUpload() {
    if (!user?.email) return;
    const next = uploadCount + 1;
    localStorage.setItem(`ls_upload_count_${user.email}`, String(next));
    setUploadCount(next);
  }

  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const canUpload = uploadCount < limits.maxUploads;

  return (
    <PlanContext.Provider
      value={{ plan, limits, upgrade, PLAN_LIMITS, uploadCount, recordUpload, canUpload }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}