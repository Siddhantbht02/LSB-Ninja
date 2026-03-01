from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./steganography.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    FILE_SIZE_LIMIT: int = 50 * 1024 * 1024
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REDIS_URL: str = "redis://localhost:6379/0"
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
