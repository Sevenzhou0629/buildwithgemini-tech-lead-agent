from typing import Optional, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    PROJECT_NAME: str = "Engineering Tech Lead Agent"
    VERSION: str = "0.1.0"
    DEBUG: bool = False

    # LLM Settings (OpenAI SDK Compatible)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: Optional[str] = None
    MODEL_NAME: str = "gpt-4o"
    REASONING_TEMPERATURE: float = 0.2

    # Database
    DATABASE_URL: str = "sqlite:///./tech_lead.db"

    # Governance & Safety
    ALLOW_EXTERNAL_WRITES: bool = False

    # MCP Mode
    MCP_MODE: Literal["mock", "hybrid", "live"] = "mock"


settings = Settings()
