import uuid
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, ConfigDict

from mantto_api.database import get_db_session
from mantto_api.modules.orders.models import Order, OrderItem

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sku: str
    quantity: int

class OrderCreate(BaseModel):
    tenant_id: uuid.UUID
    customer_ref: str
    items: list[OrderItemSchema]
    shipping_address: str | None = None
    channel: str | None = None

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: str
    customer_ref: str
    items: list[OrderItemSchema]

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

    order = Order(
        tenant_id=payload.tenant_id,
        customer_ref=payload.customer_ref,
        shipping_address=payload.shipping_address,
        channel=payload.channel,
        idempotency_key=idempotency_key,
        status="PENDING",
        total_amount_cents=0
    )
    db.add(order)
    await db.flush()

    for item in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            sku=item.sku,
            quantity=item.quantity,
            unit_price_cents=0,
            subtotal_cents=0
        )
        db.add(order_item)

    await db.commit()
    
    # Reload items
    res = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order.id)
    )
    return res.scalars().first()

@router.get("", response_model=list[OrderResponse])
async def list_orders(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Order).options(selectinload(Order.items)).limit(50))
    return result.scalars().all()
