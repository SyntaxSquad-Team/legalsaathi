import os
import uuid
import aiofiles
from fastapi import UploadFile
from backend.config import UPLOAD_DIR



async def save_uploaded_file(file: UploadFile) -> tuple[str, str]:
    """
    Save the uploaded PDF to disk.
    Returns (doc_id, saved_file_path)
    """
    doc_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[-1].lower()  # .pdf
    save_name = f"{doc_id}{extension}"
    save_path = os.path.join(UPLOAD_DIR, save_name)

    async with aiofiles.open(save_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    return doc_id, save_path


def get_file_path(doc_id: str) -> str | None:
    """
    Given a doc_id, return the full path to the PDF on disk.
    Returns None if not found.
    """
    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(doc_id):
            return os.path.join(UPLOAD_DIR, filename)
    return None


def delete_file(doc_id: str) -> bool:
    """Delete a saved file by doc_id. Returns True if deleted."""
    path = get_file_path(doc_id)
    if path and os.path.exists(path):
        os.remove(path)
        return True
    return False
