import google.generativeai as genai
from config import GEMINI_API_KEY

# Configure Gemini once at import time
genai.configure(api_key=GEMINI_API_KEY)

# Main generation model
gemini_model = genai.GenerativeModel("models/gemini-3.5-flash")

# Embedding model — used to convert text chunks to vectors
EMBEDDING_MODEL = "models/gemini-embedding-001"


def get_embedding(text: str) -> list[float]:
    """Convert a text string to a vector embedding."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]


def get_query_embedding(query: str) -> list[float]:
    """Convert a user question to a vector for retrieval."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=query,
        task_type="retrieval_query"
    )
    return result["embedding"]


def generate_answer(system_prompt: str, user_message: str) -> str:
    """
    Send a prompt to Gemini and return the text response.
    system_prompt contains the retrieved document chunks.
    user_message is the user's question.
    """
    full_prompt = f"{system_prompt}\n\nUser Question: {user_message}"
    response = gemini_model.generate_content(full_prompt)
    return response.text
