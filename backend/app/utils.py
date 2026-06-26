import hashlib
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

# --- Configuration ---
SECRET_KEY = "YOUR_SUPER_SECRET_KEY_KEEP_IT_HIDDEN" # In production, use an env variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str):
    # First hash with SHA-256 to handle any length
    hashed_sha256 = hashlib.sha256(password.encode()).digest()
    # Then use bcrypt to create the final secure hash
    return bcrypt.hashpw(hashed_sha256, bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    # Hash the incoming login password with SHA-256 first
    password_sha256 = hashlib.sha256(plain_password.encode()).digest()
    # Compare it against the stored bcrypt hash
    return bcrypt.checkpw(password_sha256, hashed_password.encode('utf-8'))

# --- JWT Logic ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt