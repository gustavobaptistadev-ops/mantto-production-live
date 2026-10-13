import uuid
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from mantto_api.database import get_db_session
from mantto_api.modules.orders.models import Order, OrderItem

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItemSchema(BaseModel):
    sku: str
    quantity: int

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    tenant_id: uuid.UUID
    customer_ref: str
    items: list[OrderItemSchema]
    shipping_address: str | None = None
    channel: str | None = None

class OrderResponse(BaseModel):
    id: uuid.UUID
    status: str
    customer_ref: str
    items: list[OrderItemSchema]

    class Config:
        from_attributes = True

@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    payload: OrderCreate,
    idempotency_key: str | None = Header(None, alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db_session)
):
    if idempotency_key:
        result = await db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.idempotency_key == idempotency_key)
        )
        existing_order = result.scalars().first()
        if existing_order:
            return existing_order

    new_order = Order(
        tenant_id=payload.tenant_id,
        customer_ref=payload.customer_ref,
        shipping_address=payload.shipping_address,
        channel=payload.channel,
        idempotency_key=idempotency_key,
        status="draft"
    )
    
    for item in payload.items:
        new_order.items.append(OrderItem(sku=item.sku, quantity=item.quantity))

    db.add(new_order)
    await db.commit()
    # Eager load the items relationship using an async query
    result = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.id == new_order.id))
    new_order = result.scalars().first()
    return new_order
