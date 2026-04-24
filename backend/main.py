import sys
import os
from datetime import datetime
from dotenv import load_dotenv

# Load Environment Variables (Sabse pehle)
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from pydantic import BaseModel

# --- PATH FIXING ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# --- LOCAL IMPORTS ---
import models
import schemas
from database import engine, SessionLocal, get_db
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    verify_access_token
)

# Router Import with Error Handling
try:
    from routers.complaints import router as complaints_router
except ImportError:
    complaints_router = None
    print("Warning: routers.complaints nahi mila.")

# --- DATABASE TABLES CREATION ---
# Yeh line ensure karti hai ki LoginHistory aur baki tables auto-create ho jayein
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Grievance System")

# --- RATE LIMITER SETUP ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# --- CORS SETUP ---
# Origins ko broad rakha hai taaki frontend kisi bhi port (5173/5174) se connect ho sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class UserLogin(BaseModel):
    email: str
    password: str

# --- OAUTH2 SCHEME ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# --- DEPENDENCIES ---
def get_current_user_email(token: str = Depends(oauth2_scheme)):
    email = verify_access_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return email

# --- ROUTES ---

@app.get("/")
def home():
    return {"message": "Digital Grievance System API is Running", "docs": "/docs"}

# --- REGISTRATION API ---
@app.post("/api/register", tags=["Authentication"], status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register_user(request: Request, user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username ya Email pehle se registered hai")
    
    try:
        hashed_pwd = get_password_hash(user_data.password)
        new_user = models.User(
            username=user_data.username, 
            email=user_data.email, 
            password=hashed_pwd, 
            role="user",
            is_admin=False # Default hamesha false rahega
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Registration successful", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# --- LOGIN API (With Admin Icon Logic) ---
@app.post("/api/login", tags=["Authentication"])
@limiter.limit("10/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.email == form_data.username) | (models.User.username == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Login record save karein
    try:
        new_log = models.LoginHistory(user_email=user.email, status="Success")
        db.add(new_log)
        db.commit()
    except Exception as e:
        print(f"History Log Error: {e}")
        db.rollback()

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    # Ye response frontend ke Navbar mein Admin icon dikhane ke liye zaroori hai
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_admin": user.is_admin,
        "username": user.username
    }

# --- ADMIN ROUTES ---

@app.get("/admin/users", tags=["Admin"])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/admin/history", tags=["Admin"])
def get_history(db: Session = Depends(get_db)):
    try:
        # Simple query if login_time ordering causes issues
        return db.query(models.LoginHistory).all()
    except Exception as e:
        return {"error": f"Table Error: {str(e)}"}

# --- CONTACT MESSAGES ---
@app.post("/contact")
def save_message(data: dict, db: Session = Depends(get_db)):
    try:
        new_msg = models.ContactMessage(
            name=data.get('name'), 
            email=data.get('email'), 
            message=data.get('message')
        )
        db.add(new_msg)
        db.commit()
        return {"status": "success", "message": "Message saved!"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.get("/messages", tags=["Admin"])
def get_messages(db: Session = Depends(get_db)):
    return db.query(models.ContactMessage).all()

# Include complaints router if exists
if complaints_router:
    app.include_router(complaints_router, prefix="/api/complaints", tags=["Complaints"])