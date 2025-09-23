"""
Application configuration and settings.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_key: str = os.getenv("API_KEY", "devkey")
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    # Database Configuration
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "password")
    postgres_db: str = os.getenv("POSTGRES_DB", "mining_pdm")
    
    # Application Configuration
    debug: bool = True
    log_level: str = "INFO"
    
    @property
    def database_url(self) -> str:
        """Get database URL from environment or construct from components."""
        # Always use SQLite for immediate development
        return "sqlite:///./mining_pdm.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
