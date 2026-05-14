from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.invoice import Invoice
from pydantic import BaseModel
from datetime import date, timedelta
from typing import List

router = APIRouter(prefix="/projections", tags=["projections"])

class ProjectionData(BaseModel):
    date: date
    balance: float
    type: str # 'actual' or 'projected'

@router.get("/30days", response_model=List[ProjectionData])
def get_30_day_projection(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Başlangıç bakiyesi (Örnek: 100.000 TL)
    # Gerçek uygulamada bu bir 'Accounts' tablosundan gelmeli
    current_balance = 100000.0 
    
    today = date.today()
    end_date = today + timedelta(days=30)
    
    # Faturaları getir (vadesi bugün veya gelecek olanlar)
    invoices = db.query(Invoice).filter(
        Invoice.user_id == current_user.id,
        Invoice.due_date >= today,
        Invoice.due_date <= end_date
    ).order_by(Invoice.due_date).all()
    
    projection = []
    
    # İlk gün (bugün)
    projection.append(ProjectionData(date=today, balance=current_balance, type="actual"))
    
    running_balance = current_balance
    
    # Her gün için bakiye hesapla
    for i in range(1, 31):
        day = today + timedelta(days=i)
        
        # O güne ait faturaları ekle/çıkar
        day_total = 0
        for inv in invoices:
            if inv.due_date == day:
                amount = float(inv.amount)
                if inv.type == "income":
                    day_total += amount
                else:
                    day_total -= amount
        
        running_balance += day_total
        projection.append(ProjectionData(date=day, balance=running_balance, type="projected"))
        
    return projection
