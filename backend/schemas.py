from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime
from typing import Optional


class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    course: str


class StudentResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    course: str
    enrollment_date: Optional[date] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)