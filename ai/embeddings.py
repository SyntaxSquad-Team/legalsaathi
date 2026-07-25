import chromadb
from config import CHROMA_DIR
from ai.gemini_client import get_embedding

# One persistent ChromaDB client shared across all requests
chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_or_create_collection(doc_id: str):
    """
    Each uploaded document gets its own ChromaDB collection.
    Collection name = doc_id (UUID).
    """
    return chroma_client.get_or_create_collection(
        name=doc_id,
        metadata={"hnsw:space": "cosine"}  # cosine similarity for semantic search
    )


import time

def store_chunks(doc_id: str, chunks: list[dict]) -> int:
    collection = get_or_create_collection(doc_id)

    texts      = [c["text"] for c in chunks]
    ids        = [f"{doc_id}_{c['chunk_index']}" for c in chunks]
    metadatas  = [{"chunk_index": c["chunk_index"]} for c in chunks]

    # Embed in small batches with delay to avoid rate limit
    embeddings = []
    for i, text in enumerate(texts):
        embeddings.append(get_embedding(text))
        if (i + 1) % 10 == 0:
            time.sleep(4)   # pause every 10 chunks

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=texts,
        metadatas=metadatas
    )

    return len(chunks)


def delete_document_chunks(doc_id: str):
    """Delete all stored chunks for a document (cleanup)."""
    try:
        chroma_client.delete_collection(name=doc_id)
    except Exception:
        pass
