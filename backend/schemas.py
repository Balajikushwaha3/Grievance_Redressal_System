from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- COMPLAINT SCHEMAS ---
class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str

class ComplaintCreate(ComplaintBase):
    pass # user_id hum token se nikalenge, manually bhejne ki zaroorat nahi

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True # SQLAlchemy models ko Pydantic mein badalne ke liye

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr # Isse automatically format check ho jayega (@ hai ya nahi)
    password: str

class UserLogin(BaseModel):
    username: str # Isme email input liya jayega
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool

    class Config:
        from_attributes = True

# --- TOKEN SCHEMAS (Auth ke liye) ---
class Token(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool # React state update karne ke liye
    username: str

class TokenData(BaseModel):
    email: Optional[str] = None