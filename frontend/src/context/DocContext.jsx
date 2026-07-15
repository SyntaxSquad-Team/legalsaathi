import React, { createContext, useContext, useState } from "react";

const DocContext = createContext(null);

export function DocProvider({ children }) {
  const [docId, setDocId]         = useState(null);
  const [filename, setFilename]   = useState(null);
  const [summary, setSummary]     = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [summaryLang, setSummaryLang] = useState("hindi"); // track which lang summary is in

  function setDocument(data) {
    setDocId(data.doc_id);
    setFilename(data.filename);
    setPageCount(data.page_count);
  }

  function clearDocument() {
    setDocId(null);
    setFilename(null);
    setSummary(null);
    setPageCount(null);
    setSummaryLang("hindi");
  }

  return (
    <DocContext.Provider value={{
      docId, filename, summary, pageCount, summaryLang,
      setDocument, setSummary, setSummaryLang, clearDocument
    }}>
      {children}
    </DocContext.Provider>
  );
}

export function useDoc() {
  return useContext(DocContext);
}
