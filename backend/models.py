from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) 
    role = Column(String, default="user") # 'role' column add kar diya hai
    is_admin = Column(Boolean, default=False)
    
    # Relationship: Ek user ki bahut saari complaints ho sakti hain
    complaints = relationship("Complaint", back_populates="owner")

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    status = Column(String, default="Pending") 
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="complaints")