import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from mantto_api.db_base import Base, TimestampMixin, UUIDMixin

class LeadSession(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "lead_sessions"

    whatsapp_number: Mapped[str] = mapped_column(String(50), index=True, unique=True)
    stage: Mapped[str] = mapped_column(String(50), default="NOVO") 
    # NOVO, CATALOGO_VISUALIZADO, CARRINHO_CRIADO, PAGO, DESISTENCIA
    
    last_interaction: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    abandoned_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    total_value_cents: Mapped[int] = mapped_column(Integer, default=0)
    
    # NOVAS MÉTRICAS DE IA
    needs_human_intervention: Mapped[bool] = mapped_column(default=False)
    sentiment: Mapped[str] = mapped_column(String(50), default="NEUTRO") # POSITIVO, NEUTRO, FRUSTRADO

    def __repr__(self) -> str:
        return f"<LeadSession {self.whatsapp_number} - {self.stage}>"

class ChatMessage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "chat_messages"

    whatsapp_number: Mapped[str] = mapped_column(String(50), index=True)
    role: Mapped[str] = mapped_column(String(20)) # "user", "assistant", "system"
    content: Mapped[str] = mapped_column(String(2000))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<ChatMessage {self.whatsapp_number} [{self.role}]: {self.content[:30]}>"
