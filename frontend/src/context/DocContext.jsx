import React, { createContext, useContext, useState } from "react";

const DocContext = createContext(null);

/**
 * DocProvider wraps the whole app.
 * Any page can read docId, summary, filename from here
 * without passing props through every component.
 */
export function DocProvider({ children }) {
  const [docId, setDocId]       = useState(null);
  const [filename, setFilename] = useState(null);
  const [summary, setSummary]   = useState(null);
  const [pageCount, setPageCount] = useState(null);

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
  }

  return (
    <DocContext.Provider value={{
      docId, filename, summary, pageCount,
      setDocument, setSummary, clearDocument
    }}>
      {children}
    </DocContext.Provider>
  );
}

export function useDoc() {
  return useContext(DocContext);
}
