"""
PharmaGraph Diagnostics - Clinical Pharmacogenomics & e-Prescribing CDS Portal
Main ASGI Application Entrypoint

Run with:
    uvicorn app:app --reload --port 8000
Or:
    python app.py
"""
import sys
import pathlib

# Ensure workspace root and backend directory are on sys.path
BASE_DIR = pathlib.Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
if str(BASE_DIR / "backend") not in sys.path:
    sys.path.insert(0, str(BASE_DIR / "backend"))

# Import main FastAPI application from backend
from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
