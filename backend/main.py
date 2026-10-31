from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas

from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Student Management System API is running"}


@app.get("/students", response_model=list[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()


@app.post("/students", response_model=schemas.StudentResponse)
def add_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Student).filter(
        models.Student.email == student.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_student = models.Student(**student.model_dump())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


@app.put("/students/{student_id}", response_model=schemas.StudentResponse)
def update_student(
    student_id: int,
    student: schemas.StudentCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Student not found")

    for key, value in student.model_dump().items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}