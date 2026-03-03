"""The Room API - FastAPI application entry point."""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sqlalchemy import text

from database import Base, engine, SessionLocal
from models import user, entry, framework
from models import security as security_models
from models import suggestion as suggestion_models
from routers import (
    auth,
    user as user_router,
    entries,
    writing as writing_router,
    insights as insights_router,
    taxonomy,
    media,
    suggestions as suggestions_router,
)
from middleware.security_headers import SecurityHeadersMiddleware
from middleware.rate_limit import RateLimitMiddleware
from config import get_settings
from utils.seed_database import seed_all

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    settings = get_settings()

    if settings.DATABASE_RESET:
        try:
            logger.warning("DATABASE_RESET flag is True - Dropping all tables")
            Base.metadata.drop_all(bind=engine)
            logger.info("All database tables dropped successfully")
        except Exception as e:
            logger.error(f"Failed to drop database tables: {e}")

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

        # Run incremental column migrations (safe to run repeatedly — uses IF NOT EXISTS)
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE chat_summaries ADD COLUMN IF NOT EXISTS tips_json JSONB"))
            conn.execute(text("ALTER TABLE chat_summaries ADD COLUMN IF NOT EXISTS key_insight TEXT"))
            conn.execute(text("ALTER TABLE chat_summaries ADD COLUMN IF NOT EXISTS patterns_json JSONB"))
            conn.execute(text("ALTER TABLE chat_summaries ADD COLUMN IF NOT EXISTS reflection_questions_json JSONB"))
            conn.execute(text("ALTER TABLE chat_suggestions ADD COLUMN IF NOT EXISTS title TEXT"))
            conn.execute(text("ALTER TABLE chat_suggestions ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'exploration'"))
            conn.execute(text("ALTER TABLE chat_suggestions ALTER COLUMN context_brief DROP NOT NULL"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS has_completed_tutorial BOOLEAN NOT NULL DEFAULT FALSE"))
            conn.commit()
        logger.info("Column migrations applied successfully")

        # Seed initial data
        db = SessionLocal()
        try:
            seed_all(db)
        finally:
            db.close()

    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        logger.warning("Application starting without database connection")

    yield

    logger.info("Application shutting down")


app = FastAPI(
    title="The Room API",
    description="Backend API for The Room journaling application",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)

settings_for_cors = get_settings()
allowed_origins = settings_for_cors.allowed_origins_list

if settings_for_cors.is_production and "*" in allowed_origins:
    logger.error("CRITICAL: Wildcard CORS not allowed in production!")
    allowed_origins = []

logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
        "X-Requested-With",
        "X-CSRF-Token",
    ],
    expose_headers=[
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
    ],
    max_age=3600,
)

app.include_router(auth.router)
app.include_router(user_router.router)
app.include_router(entries.router)
app.include_router(writing_router.router)
app.include_router(insights_router.router)
app.include_router(taxonomy.router)
app.include_router(media.router)
app.include_router(suggestions_router.router)


@app.get("/")
async def root():
    """API root endpoint."""
    return {"message": "The Room API", "status": "running"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
