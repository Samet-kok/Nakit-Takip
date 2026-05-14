from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceOut, InvoiceUploadResponse
from app.utils.gemini_client import gemini_client
from app.utils.file_handler import save_upload_file
import mimetypes

router = APIRouter(prefix="/invoices", tags=["invoices"])

MIME_MAP = {
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg", 
    "image/png": "image/png",
    "application/pdf": "application/pdf",
}

@router.post("/upload", response_model=InvoiceUploadResponse)
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dosya tipi kontrolü
    content_type = file.content_type or mimetypes.guess_type(file.filename)[0]
    mime_type = MIME_MAP.get(content_type)
    
    if not mime_type:
        raise HTTPException(
            status_code=400, 
            detail=f"Desteklenmeyen dosya tipi: {content_type}. Sadece PDF, JPG, PNG."
        )
    
    # Dosyayı oku ve kaydet
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Dosya 10MB'dan büyük olamaz")
    
    file_path = save_upload_file(file_bytes, file.filename)
    
    # 🧠 GEMINI Fatura Analiz Agent'ı çalıştır
    extracted = gemini_client.extract_invoice_data(file_bytes, mime_type)
    
    # Tarih parse et
    due_date_str = extracted.get("due_date")
    try:
        due_date = date.fromisoformat(due_date_str) if due_date_str else date.today()
    except:
        due_date = date.today()
    
    # Veritabanına kaydet
    invoice = Invoice(
        user_id=current_user.id,
        file_url=file_path,
        vendor_name=extracted.get("vendor_name"),
        amount=extracted.get("amount", 0),
        currency=extracted.get("currency", "TRY"),
        due_date=due_date,
        type=extracted.get("type", "expense"),
        status="pending",
        extracted_data=extracted
    )
    
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    return InvoiceUploadResponse(
        success=True,
        invoice=invoice,
        extracted_data=extracted,
        message=f"Fatura analiz edildi. Güven skoru: {extracted.get('confidence', 0):.0%}"
    )

@router.get("/", response_model=list[InvoiceOut])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Invoice).filter(Invoice.user_id == current_user.id).order_by(Invoice.created_at.desc()).all()

@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id, 
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Fatura bulunamadı")
    
    db.delete(invoice)
    db.commit()
    return None
