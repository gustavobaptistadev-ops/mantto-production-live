from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from mantto_api.db_base import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    admin_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    admin_password: Mapped[str] = mapped_column(String(100), nullable=True)
    llm_base_url: Mapped[str] = mapped_column(String(255), nullable=True)
    llm_api_key: Mapped[str] = mapped_column(String(255), nullable=True)
    llm_model: Mapped[str] = mapped_column(String(100), nullable=True)
    llm_temperature: Mapped[float] = mapped_column(nullable=True, default=0.0)
    negotiation_margin: Mapped[int] = mapped_column(Integer, nullable=True, default=15)
    first_attempt_discount: Mapped[int] = mapped_column(Integer, nullable=True, default=5) # Ex: 5% na primeira tentativa
    cart_rescue_discount: Mapped[int] = mapped_column(Integer, nullable=True, default=10) # Ex: 10% para resgatar carrinho
    system_prompt: Mapped[str] = mapped_column(String(2000), nullable=True)
    tone_of_voice: Mapped[str] = mapped_column(String(50), nullable=True, default="neutro")
    blacklist_words: Mapped[str] = mapped_column(String(500), nullable=True, default="")
    
    # Identidade da Loja e Anti-Alucinação
    store_name: Mapped[str] = mapped_column(String(100), nullable=True, default="Mantto")
    pix_key: Mapped[str] = mapped_column(String(100), nullable=True, default="")
    pix_beneficiary: Mapped[str] = mapped_column(String(100), nullable=True, default="")
