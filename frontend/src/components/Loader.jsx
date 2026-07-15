import React from "react";

export default function Loader({ text = "Processing..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="w-7 h-7 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
