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


def store_chunks(doc_id: str, chunks: list[dict]) -> int:
    """
    Embed and store all chunks for a document.
    Returns number of chunks stored.
    """
    collection = get_or_create_collection(doc_id)

    texts = [c["text"] for c in chunks]
    ids   = [f"{doc_id}_{c['chunk_index']}" for c in chunks]

    # Generate embeddings for all chunks
    embeddings = [get_embedding(text) for text in texts]

    # Store in ChromaDB
    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=texts,
        metadatas=[{"chunk_index": c["chunk_index"]} for c in chunks]
    )

    return len(chunks)


def delete_document_chunks(doc_id: str):
    """Delete all stored chunks for a document (cleanup)."""
    try:
        chroma_client.delete_collection(name=doc_id)
    except Exception:
        pass
