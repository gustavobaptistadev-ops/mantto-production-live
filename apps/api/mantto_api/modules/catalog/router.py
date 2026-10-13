import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from mantto_api.database import get_db_session
from mantto_api.modules.catalog.models import Product, ProductVariant, Inventory

router = APIRouter(prefix="/catalog", tags=["Catalog"])

class VariantCreate(BaseModel):
    sku: str
    name: str
    on_hand: int = 0

class ProductCreate(BaseModel):
    tenant_id: uuid.UUID
    sku: str
    name: str
    price: int
    variants: list[VariantCreate] = []

class VariantResponse(BaseModel):
    id: uuid.UUID
    sku: str
    name: str

    class ConfigDict:
        from_attributes = True

class ProductResponse(BaseModel):
    id: uuid.UUID
    sku: str
    name: str
    price: int
    variants: list[VariantResponse]

    class ConfigDict:
        from_attributes = True

@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db_session)):
    new_product = Product(
        tenant_id=payload.tenant_id,
        sku=payload.sku,
        name=payload.name,
        price=payload.price
    )
    
    for v in payload.variants:
        variant = ProductVariant(sku=v.sku, name=v.name)
        # Also create inventory directly
        inventory = Inventory(on_hand=v.on_hand, reserved=0)
        variant.inventory = inventory
        new_product.variants.append(variant)

    db.add(new_product)
    await db.commit()
    
    result = await db.execute(select(Product).options(selectinload(Product.variants)).where(Product.id == new_product.id))
    return result.scalars().first()

@router.get("/inventory/{sku}")
async def get_inventory(sku: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(
        select(Inventory).join(ProductVariant).where(ProductVariant.sku == sku)
    )
    inv = result.scalars().first()
    if not inv:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    return {"on_hand": inv.on_hand, "reserved": inv.reserved}
