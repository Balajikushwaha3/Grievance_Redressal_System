from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Database URL - 'grievance.db' file aapke backend folder mein banegi
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db" 

# 2. Engine setup (SQLite ke liye 'check_same_thread' False hona zaroori hai)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Session factory: Ye database se baat karne ka rasta hai
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class: Isse hamare models (User, Complaint) bante hain
Base = declarative_base()

# 5. Dependency: Iska use hum 'main.py' mein API endpoints ke liye karte hain
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
