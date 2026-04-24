import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError  # Agar python-jose use kar rahe hain
import secrets
import string

# --- CONFIGURATION ---
# Note: Real project mein ise .env file mein rakhein
SECRET_KEY = "your_super_secret_key_here_keep_it_safe" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- PASSWORD LOGIC (Bcrypt) ---

def get_password_hash(password: str) -> str:
    """Password ko hash karke string return karta hai."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Plain password aur hash ko compare karta hai."""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

# --- TOKEN LOGIC (JWT) ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT Access Token create karta hai."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> Optional[str]:
    """Token verify karta hai aur user email (sub) return karta hai."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except (JWTError, jwt.PyJWTError): # Dono libraries ke liye safety
        return None

# --- API KEY LOGIC ---

def generate_api_key(length: int = 32) -> str:
    """Random API key generate karta hai."""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

def verify_api_key(api_key: str, db) -> Optional[int]:
    """API key verify karta hai aur user_id return karta hai agar valid hai."""
    from models import APIKey
    key_record = db.query(APIKey).filter(
        APIKey.key == api_key,
        APIKey.is_active == True
    ).first()
    
    if key_record:
        return key_record.user_id
    return None

