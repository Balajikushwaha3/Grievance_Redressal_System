from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import verify_access_token # Auth se token check karne ke liye
from fastapi.security import OAuth2PasswordBearer

router = APIRouter() # Prefix hum main.py mein handle kar rahe hain

# Token nikalne ke liye setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# --- TOKEN SE USER NIKALNE KI DEPENDENCY ---
def get_current_user_email(token: str = Depends(oauth2_scheme)):
    email = verify_access_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return email

# 1. CREATE COMPLAINT (Sirf Logged-in User)
@router.post("/", response_model=schemas.ComplaintResponse)
def create_complaint(
    complaint: schemas.ComplaintCreate, 
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    # Pehle user ki ID nikalte hain email se
    user = db.query(models.User).filter(models.User.email == current_user_email).first()
    
    # Nayi complaint banana
    db_complaint = models.Complaint(
        title=complaint.title,
        description=complaint.description,
        category=complaint.category,
        user_id=user.id, # Automatically token se user_id mil gayi
        status="Pending"
    )
    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

# 2. READ COMPLAINTS (Admin ko sab dikhega, User ko sirf apni)
@router.get("/")
def read_complaint(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    user = db.query(models.User).filter(models.User.email == current_user_email).first()
    
    if user.is_admin:
        return db.query(models.Complaint).all() # Admin ko sab kuch dikhao
    
    return db.query(models.Complaint).filter(models.Complaint.user_id == user.id).all() # User ko sirf apni

# 3. RESOLVE COMPLAINT (Sirf Admin kar sakta hai)
@router.put("/{complaint_id}/resolve")
def resolve_complaint(
    complaint_id: int, 
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    # Check karein ki user Admin hai ya nahi
    user = db.query(models.User).filter(models.User.email == current_user_email).first()
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Sirf Admin hi ise resolve kar sakta hai")

    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint nahi mili")
    
    complaint.status = "Resolved"
    db.commit()
    return {"message": "Complaint successfully resolve ho gayi hai"}