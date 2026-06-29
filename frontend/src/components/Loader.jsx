import React from "react";

export default function Loader({ text = "Processing..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
