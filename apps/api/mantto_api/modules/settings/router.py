from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from mantto_api.database import get_db_session
from mantto_api.modules.settings.models import SystemSettings

router = APIRouter(prefix="/settings", tags=["Settings"])

class SettingsUpdate(BaseModel):
    admin_phone: str | None = None
    admin_password: str | None = None
    llm_base_url: str | None = None
    llm_api_key: str | None = None
    llm_model: str | None = None
    llm_temperature: float | None = None
    negotiation_margin: int | None = None
    system_prompt: str | None = None
    system_prompt: str | None = None
    tone_of_voice: str | None = None
    blacklist_words: str | None = None
    store_name: str | None = None
    pix_key: str | None = None
    pix_beneficiary: str | None = None

@router.get("/")
async def get_settings(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = result.scalars().first()
    
    if not settings:
        settings = SystemSettings(id=1, negotiation_margin=15, llm_temperature=0.0)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        
    return settings

@router.post("/")
async def update_settings(data: SettingsUpdate, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = result.scalars().first()
    
    if not settings:
        settings = SystemSettings(id=1)
        db.add(settings)
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    await db.commit()
    return {"status": "success", "message": "Configurações atualizadas"}
