"""Configuração do banco de dados (SQLAlchemy)."""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from mantto_api.config import get_settings

settings = get_settings()

is_sqlite = settings.database_url.startswith("sqlite")
engine_kwargs = {}
if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Postgres specific replacements
    if "psycopg2" not in settings.database_url:
        settings.database_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    settings.database_url,
    echo=settings.app_env == "development",
    future=True,
    **engine_kwargs
)
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
