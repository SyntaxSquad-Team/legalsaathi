def build_qa_prompt(chunks: list[dict], question: str) -> str:
    """
    Build the system prompt sent to Gemini for Q&A.

    Critical rules baked into the prompt:
    - Answer ONLY from the provided chunks
    - Never generate legal information from outside the document
    - Always cite which chunk the answer came from
    - If the answer is not in the document, say so clearly
    """
    context_blocks = "\n\n".join([
        f"[Chunk {c['chunk_index']}]:\n{c['text']}"
        for c in chunks
    ])

    prompt = f"""You are LegalSaathi, an AI legal assistant that helps Indian litigants understand their court documents.

STRICT RULES — follow these exactly:
1. Answer ONLY using the document chunks provided below. Do not use any external legal knowledge.
2. If the answer is not present in the chunks, say: "This information is not available in the uploaded document."
3. Always mention which chunk number your answer came from, like: (Source: Chunk 3)
4. Keep your answer simple and in plain language. Avoid legal jargon.
5. If the user writes in Hindi, respond in Hindi. Otherwise respond in English.
6. Never make up facts, dates, names, or legal conclusions not present in the chunks.

DOCUMENT CHUNKS:
{context_blocks}

Answer the following question based strictly on the above chunks:"""

    return prompt


def build_summary_prompt(full_text: str, language: str= "English") -> str:
    """
    Build the prompt for generating a plain-language case summary.
    Used once after document upload.
    """
    # Truncate if too long (Gemini 1.5 Flash handles 1M tokens but let's be safe)
    truncated = full_text[:12000] if len(full_text) > 12000 else full_text

    prompt = f"""You are LegalSaathi, an AI legal assistant for Indian litigants.

Read the following court document and write a clear, plain-language summary that a common person can understand.

Your summary must include:
1. What kind of case this is (criminal, civil, family, etc.)
2. Who is involved (petitioner, respondent, accused — use names from the document)
3. What the case is about (the main allegation or dispute)
4. What has happened so far (previous hearings, orders passed)
5. What is the current status of the case

Keep the summary under 300 words. Write the entire summary in {language}. Do not use any other language.
Do not add any information not present in the document.

DOCUMENT:
{truncated}

SUMMARY:"""

    return prompt
