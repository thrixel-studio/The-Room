from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from typing import Generator
from config import get_settings

settings = get_settings()

# Optimized connection pooling for better performance
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_pre_ping=True,        # Verify connections before use
    pool_size=20,              # Increased from 10 to 20 connections
    max_overflow=10,           # Reduced from 20 to 10 (total max = 30)
    pool_recycle=3600,         # Recycle connections after 1 hour
    echo=False,                # Disable SQL logging for performance
    connect_args={
        "options": "-c timezone=utc"
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
