from ai.chunker import chunk_text
from ai.embeddings import store_chunks, delete_document_chunks
from ai.retriever import retrieve_relevant_chunks
from ai.prompt import build_qa_prompt, build_summary_prompt
from ai.gemini_client import generate_answer


def process_document(doc_id: str, extracted_text: str) -> int:
    """
    Full pipeline: text -> chunks -> embeddings -> ChromaDB storage.
    Called after OCR completes.

    Returns number of chunks stored.
    """
    chunks = chunk_text(extracted_text)
    count = store_chunks(doc_id, chunks)
    return count


def get_answer(doc_id: str, question: str) -> dict:
    """
    Full Q&A pipeline:
    question -> retrieve chunks -> build prompt -> Gemini -> answer + citations

    Returns:
    {
        "answer": "...",
        "citations": [{ "chunk_index": 2, "source_text": "..." }, ...]
    }
    """
    # Step 1: retrieve most relevant chunks
    chunks = retrieve_relevant_chunks(doc_id, question)

    if not chunks:
        return {
            "answer": "No relevant content found in the uploaded document for this question.",
            "citations": []
        }

    # Step 2: build the system prompt
    system_prompt = build_qa_prompt(chunks, question)

    # Step 3: call Gemini
    answer = generate_answer(system_prompt, question)

    # Step 4: format citations
    citations = [
        {"chunk_index": c["chunk_index"], "source_text": c["text"]}
        for c in chunks
    ]

    return {"answer": answer, "citations": citations}


def get_summary(extracted_text: str, language: str = "English") -> str:
    """
    Generate a plain-language summary of the full document.
    Called once after upload and OCR.
    """
    prompt = build_summary_prompt(extracted_text, language)
    summary = generate_answer("", prompt)   # no separate system prompt needed here
    return summary


def cleanup_document(doc_id: str):
    """Remove all stored vectors for a document from ChromaDB."""
    delete_document_chunks(doc_id)
