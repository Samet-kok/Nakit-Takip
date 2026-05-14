from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.database import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(String(500), nullable=True)
    vendor_name = Column(String(255), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="TRY")
    due_date = Column(Date, nullable=False)
    type = Column(String(10), nullable=False)  # 'income' or 'expense'
    status = Column(String(20), default="pending")  # pending, paid, overdue, risk
    extracted_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
