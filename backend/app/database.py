from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

# Load the credentials from your .env file
load_dotenv()

# The URL we set up in your .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine (the connection pool)
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl": {
            "ca": "ca.pem"
        }
    }
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Standard SQLAlchemy 2.0 Base class
class Base(DeclarativeBase):
    pass

# Dependency to provide a database session to our API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()