from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Integer as IntCol, JSON
from sqlalchemy.sql import func
from app.database import Base

class AgentLog(Base):
    __tablename__ = "agent_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    input_snapshot = Column(JSON, nullable=True)
    output_snapshot = Column(JSON, nullable=True)
    latency_ms = Column(IntCol, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
