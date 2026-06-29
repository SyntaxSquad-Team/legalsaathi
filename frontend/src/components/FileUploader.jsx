import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFileSelect, uploading }) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${isDragActive
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 hover:border-primary-200 hover:bg-primary-50"
        }
        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      {/* Upload icon */}
      <div className="w-12 h-12 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <p className="text-sm font-medium text-gray-700">
        {isDragActive ? "Drop the file here" : "Drag and drop your court document"}
      </p>
      <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG up to 20 MB</p>

      <button
        type="button"
        disabled={uploading}
        className="mt-4 px-4 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        Browse Files
      </button>
    </div>
  );
}
