import uuid
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from mantto_api.database import get_db_session
from mantto_api.modules.payments.models import WebhookEvent

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

class WebhookPayload(BaseModel):
    event_id: str
    type: str
    data: dict

@router.post("/provider")
async def provider_webhook(
    payload: WebhookPayload,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    # 1. Idempotency Check
    result = await db.execute(select(WebhookEvent).where(WebhookEvent.event_id == payload.event_id))
    existing_event = result.scalars().first()
    
    if existing_event:
        return {"status": "already_processed"}

    # 2. Signature Validation (mocked for MVP test)
    # TODO: Add logic like hmac validation here based on provider config

    # 3. Store Event
    new_event = WebhookEvent(
        event_id=payload.event_id,
        provider="provider",
        event_type=payload.type,
        payload=payload.data,
        processed=True
    )
    
    db.add(new_event)
    
    # 4. Process Payment based on event_type
    if payload.type == "payment.success":
        # logic to find payment and update status, then update order
        pass

    await db.commit()
    
    return {"status": "ok"}
