from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.agent_log import AgentLog
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/agents", tags=["agents"])

class AgentLogOut(BaseModel):
    id: int
    agent_name: str
    input_snapshot: Optional[dict]
    output_snapshot: Optional[dict]
    latency_ms: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/logs", response_model=list[AgentLogOut])
def get_agent_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kullanıcıya ait veya genel logları getir
    return db.query(AgentLog).filter(
        (AgentLog.user_id == current_user.id) | (AgentLog.user_id == None)
    ).order_by(AgentLog.created_at.desc()).limit(50).all()
