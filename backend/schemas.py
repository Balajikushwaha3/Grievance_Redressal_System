from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- COMPLAINT SCHEMAS ---
class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str

class ComplaintCreate(ComplaintBase):
    pass 

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True 

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr  # Swagger mein 'username' ki jagah 'email' dikhega toh confusion nahi hoga
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    role: str # Kyunki aapne models.py mein 'role' column rakha hai

    class Config:
        from_attributes = True

# --- TOKEN SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool 
    username: str

class TokenData(BaseModel):
    email: Optional[str] = None