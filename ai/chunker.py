from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_text(text: str) -> list[dict]:
    """
    Split extracted document text into overlapping chunks.

    chunk_size=500     — each chunk is ~500 characters
    chunk_overlap=50   — 50 characters shared between adjacent chunks
                         so no context is lost at chunk boundaries

    Returns a list of dicts:
    [
        { "chunk_index": 0, "text": "..." },
        { "chunk_index": 1, "text": "..." },
        ...
    ]
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    raw_chunks = splitter.split_text(text)

    return [
        {"chunk_index": i, "text": chunk.strip()}
        for i, chunk in enumerate(raw_chunks)
        if chunk.strip()   # skip empty chunks
    ]
