import os
import time
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

# Initialize Pinecone client
pc    = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX", "legalsaathi"))


def store_chunks(doc_id: str, chunks: list[dict]) -> int:
    """
    Embed and store all chunks for a document in Pinecone.
    Each vector ID = doc_id_chunkindex so multiple documents
    coexist in the same index without conflict.
    """
    from backend.ai.gemini_client import get_embedding

    vectors = []
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk["text"])
        vectors.append({
            "id":     f"{doc_id}_{chunk['chunk_index']}",
            "values": embedding,
            "metadata": {
                "doc_id":      doc_id,
                "chunk_index": chunk["chunk_index"],
                "text":        chunk["text"],
            }
        })
        # Pause every 10 chunks to stay within free tier rate limits
        if (i + 1) % 10 == 0:
            time.sleep(2)

    # Upsert in batches of 100
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i + 100])

    return len(chunks)


def delete_document_chunks(doc_id: str):
    """Delete all stored vectors for a document from Pinecone."""
    try:
        index.delete(filter={"doc_id": {"$eq": doc_id}})
    except Exception as e:
        print(f"Warning: could not delete chunks for {doc_id}: {e}")
