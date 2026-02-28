"""Application configuration and settings management."""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration from environment variables."""

    DATABASE_URL: str
    DATABASE_RESET: bool
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    OPENAI_API_KEY: str
    OPENAI_ASSISTANT_MODEL: str
    OPENAI_SUMMARY_MODEL: str
    OPENAI_TITLE_MODEL: str
    OPENAI_IMAGE_MODEL: str
    OPENAI_IMAGE_SIZE: str
    OPENAI_IMAGE_QUALITY: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    FRONTEND_URL: str
    ALLOWED_ORIGINS: str
    ENVIRONMENT: str
    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    S3_BUCKET: str
    S3_PREFIX: str
    WEBP_QUALITY: int = 85

    class Config:
        env_file = ".env"

    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse allowed origins from comma-separated string."""
        if self.ALLOWED_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings instance."""
    return Settings()
