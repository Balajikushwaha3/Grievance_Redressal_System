# make_admin.py (backend folder mein banayein)
from database import SessionLocal
import models

db = SessionLocal()
# Apni email id yahan likhein
user = db.query(models.User).filter(models.User.email == "aapki-email@example.com").first()

if user:
    user.is_admin = True
    db.commit()
    print(f"Success: {user.username} ab Admin ban gaya hai!")
else:
    print("Error: User nahi mila.")
db.close()