"""Configuração do banco de dados (SQLAlchemy)."""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from mantto_api.config import get_settings

settings = get_settings()

db_url = settings.database_url
is_sqlite = db_url.startswith("sqlite")
engine_kwargs: dict = {}

if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Garantir driver assíncrono asyncpg para PostgreSQL em nuvem
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)

    # Configurações de resiliência e pool para Postgres Render / AWS / Supabase
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_async_engine(
    db_url,
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
