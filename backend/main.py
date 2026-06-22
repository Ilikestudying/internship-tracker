from datetime import date
from typing import Optional

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, InternshipDB

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://internship-tracker-flax.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Internship(BaseModel):
    company: str
    role: str
    status: str
    date_applied: Optional[date] = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Internship Tracker API is running"}


@app.get("/internships")
def get_internships(db: Session = Depends(get_db)):
    return db.query(InternshipDB).all()


@app.post("/internships")
def add_internship(internship: Internship, db: Session = Depends(get_db)):
    new_internship = InternshipDB(
        company=internship.company,
        role=internship.role,
        status=internship.status,
        date_applied=internship.date_applied
    )

    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)

    return {
        "message": "Internship added successfully",
        "internship": new_internship
    }


@app.put("/internships/{internship_id}")
def update_internship(
    internship_id: int,
    internship: Internship,
    db: Session = Depends(get_db)
):
    existing_internship = (
        db.query(InternshipDB)
        .filter(InternshipDB.id == internship_id)
        .first()
    )

    if existing_internship is None:
        return {"message": "Internship not found"}

    existing_internship.company = internship.company
    existing_internship.role = internship.role
    existing_internship.status = internship.status
    existing_internship.date_applied = internship.date_applied

    db.commit()
    db.refresh(existing_internship)

    return {
        "message": "Internship updated successfully",
        "internship": existing_internship
    }


@app.delete("/internships/{internship_id}")
def delete_internship(
    internship_id: int,
    db: Session = Depends(get_db)
):
    existing_internship = (
        db.query(InternshipDB)
        .filter(InternshipDB.id == internship_id)
        .first()
    )

    if existing_internship is None:
        return {"message": "Internship not found"}

    db.delete(existing_internship)
    db.commit()

    return {"message": "Internship deleted successfully"}