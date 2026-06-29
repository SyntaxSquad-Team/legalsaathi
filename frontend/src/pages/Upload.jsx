import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import Loader from "../components/Loader";
import { uploadDocument, getSummary } from "../services/api";
import { useDoc } from "../context/DocContext";

export default function Upload() {
  const navigate = useNavigate();
  const { setDocument, setSummary } = useDoc();

  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [stage, setStage]           = useState("");   // label shown to user
  const [error, setError]           = useState(null);

  async function handleFileSelect(file) {
    setError(null);
    setUploading(true);

    try {
      // Stage 1: upload + OCR
      setStage("Uploading and extracting text...");
      const uploadData = await uploadDocument(file, (evt) => {
        const pct = Math.round((evt.loaded * 100) / evt.total);
        setProgress(pct);
      });

      setDocument(uploadData);

      // Stage 2: generate summary
      setStage("Generating case summary...");
      const summaryData = await getSummary(uploadData.doc_id);
      setSummary(summaryData.summary);

      // Done — go to summary page
      navigate("/summary");

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Something went wrong. Make sure the backend is running."
      );
    } finally {
      setUploading(false);
      setProgress(0);
      setStage("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Upload Court Document</h1>
      <p className="text-sm text-gray-500 mb-8">
        Upload a FIR, chargesheet, bail order, or any court order. Supported formats: PDF, JPG, PNG.
      </p>

      {!uploading ? (
        <FileUploader onFileSelect={handleFileSelect} uploading={uploading} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <Loader text={stage || "Processing..."} />
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading file</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* What we support */}
      <div className="mt-8 bg-primary-50 border border-primary-100 rounded-lg p-4">
        <p className="text-xs font-medium text-primary-500 mb-2">What you can upload</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>FIR (First Information Report)</li>
          <li>Chargesheet</li>
          <li>Bail orders and court orders</li>
          <li>Previous hearing notes</li>
          <li>Any typed or scanned court document</li>
        </ul>
      </div>
    </div>
  );
}
