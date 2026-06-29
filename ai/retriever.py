import chromadb
from config import CHROMA_DIR
from ai.gemini_client import get_query_embedding

chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)

TOP_K = 5   # number of most relevant chunks to retrieve per question


def retrieve_relevant_chunks(doc_id: str, question: str) -> list[dict]:
    """
    Given a doc_id and a user question:
    1. Embed the question
    2. Find the TOP_K most semantically similar chunks in ChromaDB
    3. Return them with their index and text

    Returns:
    [
        { "chunk_index": 2, "text": "...", "score": 0.91 },
        ...
    ]
    """
    try:
        collection = chroma_client.get_collection(name=doc_id)
    except Exception:
        raise ValueError(f"No document found with ID: {doc_id}. Please upload the document first.")

    query_embedding = get_query_embedding(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(TOP_K, collection.count()),
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for i in range(len(results["documents"][0])):
        chunks.append({
            "chunk_index": results["metadatas"][0][i]["chunk_index"],
            "text": results["documents"][0][i],
            "score": round(1 - results["distances"][0][i], 4)  # convert distance to similarity
        })

    # Sort by relevance score descending
    chunks.sort(key=lambda x: x["score"], reverse=True)
    return chunks
