import fastapi, fitz, PIL, numpy, langchain, dotenv

print("FastAPI:", fastapi.__version__)
print("PyMuPDF:", fitz.__doc__[:30], "...")
print("Pillow:", PIL.__version__)
print("NumPy:", numpy.__version__)
print("LangChain:", langchain.__version__)
print("dotenv loaded OK")
