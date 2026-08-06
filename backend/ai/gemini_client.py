import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY")
print(GEMINI_API_KEY[:10])
for model in genai.list_models():
    if "embedding" in model.name:
        print("\nTesting:", model.name)
        try:
            result = genai.embed_content(
                model=model.name,
                content="Hello world",
                task_type="retrieval_document"
            )
            print("Dimension:", len(result["embedding"]))
        except Exception as e:
            print("Error:", e)

genai.configure(api_key=GEMINI_API_KEY)

# Primary model — gemini-2.0-flash-lite (mentor suggestion)
gemini_model = genai.GenerativeModel("gemini-2.0-flash-lite")

EMBEDDING_MODEL = "models/gemini-embedding-001"

# ── Embeddings — Gemini only (Groq does not support embeddings) ───────────────

def get_embedding(text: str) -> list[float]:
    """Convert text to vector embedding using Gemini."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]

embedding=get_embedding("hrllo")
print(len(embedding))

def get_query_embedding(query: str) -> list[float]:
    """Convert a user question to a vector for retrieval."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=query,
        task_type="retrieval_query"
    )
    return result["embedding"]


# ── Text Generation — Gemini primary, Groq fallback ──────────────────────────

def generate_answer(system_prompt: str, user_message: str) -> str:
    """
    Try Gemini 2.0 Flash Lite first.
    If it fails (rate limit, quota, network), fall back to Groq llama3.
    If both fail, return a safe error message.
    """
    full_prompt = f"{system_prompt}\n\nUser Question: {user_message}"

    # --- Primary: Gemini ---
    try:
        response = gemini_model.generate_content(full_prompt)
        return response.text

    except Exception as gemini_error:
        print(f"[Gemini failed] {gemini_error} — trying Groq fallback...")

        # --- Fallback: Groq ---
        try:
            return _groq_generate(system_prompt, user_message)
        except Exception as groq_error:
            print(f"[Groq also failed] {groq_error}")
            return (
                "Both AI providers are temporarily unavailable. "
                "Please try again in a moment."
            )


def _groq_generate(system_prompt: str, user_message: str) -> str:
    """
    Generate answer using Groq (llama-3.3-70b-versatile).
    Free tier — 6000 tokens/min, 500k tokens/day.
    """
    from groq import Groq

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set in environment.")

    client = Groq(api_key=GROQ_API_KEY)

    # Build messages for Groq chat format
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_message})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=1024,
        temperature=0.3,
    )

    return completion.choices[0].message.content


def generate_summary(prompt: str) -> str:
    """
    Generate case summary — Gemini primary, Groq fallback.
    Same pattern as generate_answer but accepts a single combined prompt.
    """
    # --- Primary: Gemini ---
    try:
        response = gemini_model.generate_content(prompt)
        return response.text

    except Exception as gemini_error:
        print(f"[Gemini summary failed] {gemini_error} — trying Groq...")

        try:
            from groq import Groq
            if not GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY not set.")

            client = Groq(api_key=GROQ_API_KEY)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024,
                temperature=0.3,
            )
            return completion.choices[0].message.content

        except Exception as groq_error:
            print(f"[Groq summary also failed] {groq_error}")
            return "Summary generation temporarily unavailable. Please try again."
