"""Configuração por ambiente. Segredos vêm apenas de variáveis de ambiente."""

from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    database_url: str = "sqlite+aiosqlite:///../mantto_dev.db"
    redis_url: str = "redis://redis:6379/0"

    # Camada de LLM OpenAI-compatible (OpenAI, vLLM, FreeLLMAPI, ...).
    llm_base_url: str = "https://api.openai.com/v1"
    llm_api_key: SecretStr = SecretStr("")
    llm_model: str = ""

    jwt_secret: SecretStr = SecretStr("")


@lru_cache
def get_settings() -> Settings:
    return Settings()
