import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

# Initialize Pinecone client
pc    = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX", "legalsaathi"))

TOP_K = 5


def retrieve_relevant_chunks(doc_id: str, question: str) -> list[dict]:
    """
    Embed the question, search Pinecone for the top K most
    relevant chunks belonging to this specific doc_id only.

    Returns:
    [
        { "chunk_index": 2, "text": "...", "score": 0.91 },
        ...
    ]
    """
    from backend.ai.gemini_client import get_query_embedding

    query_embedding = get_query_embedding(question)

    results = index.query(
        vector=query_embedding,
        top_k=TOP_K,
        filter={"doc_id": {"$eq": doc_id}},
        include_metadata=True,
    )

    chunks = []
    for match in results.matches:
        chunks.append({
            "chunk_index": match.metadata.get("chunk_index", 0),
            "text":        match.metadata.get("text", ""),
            "score":       round(match.score, 4),
        })

    # Sort by relevance score descending
    chunks.sort(key=lambda x: x["score"], reverse=True)
    return chunks
