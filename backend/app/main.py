from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, invoices, agents

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NakitTakip API",
    description="HACKATHON'26 - KOBİ Agentic Nakit Akışı Yönetimi",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(invoices.router)
app.include_router(agents.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "nakittakip-api"}
