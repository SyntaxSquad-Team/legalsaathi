import fitz          # PyMuPDF
import pytesseract
from PIL import Image
import io


def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    """
    Extract all text from a PDF file.
    First tries native text extraction (typed PDFs).
    Falls back to OCR (Tesseract) for scanned/image PDFs.

    Returns (extracted_text, page_count)
    """
    doc = fitz.open(file_path)
    page_count = len(doc)
    full_text = []

    for page_num in range(page_count):
        page = doc[page_num]

        # Try native text extraction first
        text = page.get_text().strip()

        if len(text) > 50:
            # Page has readable text — use it directly
            full_text.append(f"[Page {page_num + 1}]\n{text}")
        else:
            # Page is likely scanned — use OCR
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_bytes))

            # pytesseract can handle Hindi + English together
            ocr_text = pytesseract.image_to_string(
                image,
                lang="eng+hin",     # add more langs if needed e.g. "eng+hin+tel"
                config="--psm 6"    # assume uniform block of text
            ).strip()

            if ocr_text:
                full_text.append(f"[Page {page_num + 1}]\n{ocr_text}")

    doc.close()
    combined = "\n\n".join(full_text)
    return combined, page_count


def is_scanned_pdf(file_path: str) -> bool:
    """
    Quick check: returns True if the PDF has no native text (likely scanned).
    Useful for showing the user what mode was used.
    """
    doc = fitz.open(file_path)
    total_text = ""
    for page in doc:
        total_text += page.get_text()
    doc.close()
    return len(total_text.strip()) < 100
