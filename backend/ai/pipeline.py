from backend.ai.chunker import chunk_text
from backend.ai.embeddings import store_chunks, delete_document_chunks
from backend.ai.retriever import retrieve_relevant_chunks
from backend.ai.prompt import build_qa_prompt, build_summary_prompt
from backend.ai.gemini_client import generate_answer, generate_summary


def process_document(doc_id: str, extracted_text: str) -> int:
    """
    Full pipeline: text -> chunks -> embeddings -> Pinecone storage.
    Called after OCR completes.
    Returns number of chunks stored.
    """
    chunks = chunk_text(extracted_text)
    count  = store_chunks(doc_id, chunks)
    return count


def get_answer(doc_id: str, question: str) -> dict:
    """
    Full Q&A pipeline with Gemini primary + Groq fallback.
    question -> retrieve chunks -> build prompt -> generate -> answer + citations
    """
    chunks = retrieve_relevant_chunks(doc_id, question)

    if not chunks:
        return {
            "answer": "No relevant content found in the uploaded document for this question.",
            "citations": []
        }

    system_prompt = build_qa_prompt(chunks, question)

    # generate_answer handles Gemini -> Groq fallback internally
    answer = generate_answer(system_prompt, question)

    citations = [
        {"chunk_index": c["chunk_index"], "source_text": c["text"]}
        for c in chunks
    ]

    return {"answer": answer, "citations": citations}


def get_summary(extracted_text: str, language: str = "English") -> str:
    """
    Generate plain-language case summary with Gemini + Groq fallback.
    """
    prompt = build_summary_prompt(extracted_text, language)

    # generate_summary handles Gemini -> Groq fallback internally
    return generate_summary(prompt)


def cleanup_document(doc_id: str):
    """Remove all stored vectors for a document from Pinecone."""
    delete_document_chunks(doc_id)
