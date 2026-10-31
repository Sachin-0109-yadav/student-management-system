from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15))
    course = Column(String(100), nullable=False)
    enrollment_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())