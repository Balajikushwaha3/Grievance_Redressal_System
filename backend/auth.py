import bcrypt
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional

# JWT Configuration
SECRET_KEY = "your_super_secret_key_here_keep_it_safe" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- PASSWORD LOGIC (Using Direct Bcrypt) ---

def get_password_hash(password: str) -> str:
    # Password ko bytes mein convert karein
    pwd_bytes = password.encode('utf-8')
    # Salt generate karein aur hash banayein
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Database mein save karne ke liye string mein badlein
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

# --- TOKEN GENERATION LOGIC ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        return email if email else None
    except JWTError:
        return None