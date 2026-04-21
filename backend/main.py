import sys
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

# --- PATH FIXING ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# --- MODELS & DATABASE IMPORTS ---
import models
from database import engine, SessionLocal
from auth import get_password_hash, verify_password, create_access_token

# Router Import
try:
    from routers import complaints
except ImportError:
    import complaints

# Database tables automatically create karein
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Grievance System")

# --- CONNECTIVITY (CORS) SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
def home():
    return {"message": "Digital Grievance System API is Running", "docs": "/docs"}

# --- REGISTRATION API ---
@app.post("/api/register", tags=["Authentication"])
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Check karein agar email ya username pehle se hai
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username ya Email pehle se registered hai")
    
    # 2. Password ko secure karein
    hashed_pwd = get_password_hash(user_data.password)
    
    # 3. Naya user banayein (Models.py ke fields ke saath match karte huye)
    new_user = models.User(
        username=user_data.username, 
        email=user_data.email, 
        password=hashed_pwd, 
        role="user",      # Models.py mein 'role' column hona chahiye
        is_admin=False    # Models.py mein 'is_admin' column hona chahiye
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User successfully register ho gaya!", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        print(f"DATABASE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Database mein data save nahi ho paya")

# --- LOGIN API ---
@app.post("/api/login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Email ya Username dono se login allow karein
    user = db.query(models.User).filter(
        (models.User.email == form_data.username) | (models.User.username == form_data.username)
    ).first()
    
    # Password check karein
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Token generate karein
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_admin": user.is_admin, # Models.py se true/false uthayega
        "user": {
            "username": user.username,
            "role": user.role
        }
    }

# Complaints router include karein
app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])