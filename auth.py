from argon2 import PasswordHasher
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ph = PasswordHasher()


def hash_password(password: str):
    return ph.hash(password)


def verify_password(plain: str, hashed: str):
    try:
        ph.verify(hashed, plain)
        return True
    except:
        return False


def create_access_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)