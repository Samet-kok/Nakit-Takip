from sqlalchemy import Column, Integer, Numeric, Date, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from app.database import Base

class CashProjection(Base):
    __tablename__ = "cash_projections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    projection_date = Column(Date, nullable=False)
    projected_balance = Column(Numeric(12, 2), nullable=False)
    scenario = Column(String(20), default="base")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
