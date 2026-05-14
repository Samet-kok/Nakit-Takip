import os
import uuid
from pathlib import Path

# Backend dizini içinde uploads klasörü oluşturur
UPLOAD_DIR = Path("uploads/invoices")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def save_upload_file(file_bytes: bytes, original_filename: str) -> str:
    """
    Yüklenen dosyayı benzersiz bir isimle kaydeder.
    """
    ext = Path(original_filename).suffix or ".pdf"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    
    return str(file_path)
