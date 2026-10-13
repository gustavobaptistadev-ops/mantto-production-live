import uuid
from typing import Optional

from sqlalchemy import String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from mantto_api.db_base import Base, TimestampMixin, UUIDMixin

class Payment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "payments"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), index=True)
    amount_cents: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(50), default="pending") # pending, paid, failed, refunded
    provider: Mapped[str] = mapped_column(String(50)) # stripe, mercadopago, etc
    provider_id: Mapped[Optional[str]] = mapped_column(String(255), index=True)
    payment_method: Mapped[Optional[str]] = mapped_column(String(100))

class WebhookEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "webhook_events"

    event_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    provider: Mapped[str] = mapped_column(String(50))
    event_type: Mapped[str] = mapped_column(String(100))
    payload: Mapped[dict] = mapped_column(JSONB)
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
