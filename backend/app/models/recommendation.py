from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, String, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    severity = Column(String(10), nullable=False)  # low, medium, high, critical
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
