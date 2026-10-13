import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from mantto_api.database import get_db_session
from mantto_api.modules.auth.models import Tenant

router = APIRouter(prefix="/auth", tags=["Auth"])


class TenantCreate(BaseModel):
    name: str

class TenantResponse(BaseModel):
    id: uuid.UUID
    name: str
    is_active: bool

    class Config:
        from_attributes = True


@router.post("/tenants", response_model=TenantResponse)
async def create_tenant(tenant: TenantCreate, db: AsyncSession = Depends(get_db_session)):
    new_tenant = Tenant(name=tenant.name)
    db.add(new_tenant)
    await db.commit()
    await db.refresh(new_tenant)
    return new_tenant

@router.get("/tenants", response_model=list[TenantResponse])
async def list_tenants(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Tenant))
    return result.scalars().all()
