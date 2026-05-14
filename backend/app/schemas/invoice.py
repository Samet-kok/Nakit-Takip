from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, Any

class InvoiceCreate(BaseModel):
    vendor_name: Optional[str] = None
    amount: Decimal
    currency: str = "TRY"
    due_date: date
    type: str  # income or expense
    file_url: Optional[str] = None
    extracted_data: Optional[dict] = None

class InvoiceOut(BaseModel):
    id: int
    user_id: int
    vendor_name: Optional[str]
    amount: Decimal
    currency: str
    due_date: date
    type: str
    status: str
    file_url: Optional[str]
    extracted_data: Optional[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvoiceUploadResponse(BaseModel):
    success: bool
    invoice: InvoiceOut
    extracted_data: dict
    message: str
