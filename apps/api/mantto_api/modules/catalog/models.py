import uuid
from typing import Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from mantto_api.db_base import Base, TimestampMixin, UUIDMixin


class Product(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "products"

    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"), index=True)
    sku: Mapped[str] = mapped_column(String(100), index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(String)
    price: Mapped[int] = mapped_column(Integer, comment="Preço em centavos")
    promotional_price: Mapped[int | None] = mapped_column(Integer, comment="Preço promo em centavos")
    status: Mapped[str] = mapped_column(String(50), default="active") # active, draft, archived
    attributes: Mapped[dict | None] = mapped_column(JSONB)

    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product")


class ProductVariant(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_variants"

    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), index=True)
    sku: Mapped[str] = mapped_column(String(100), index=True, unique=True)
    name: Mapped[str] = mapped_column(String(255))
    price_override: Mapped[int | None] = mapped_column(Integer, comment="Se null, usa o do produto")
    attributes: Mapped[dict | None] = mapped_column(JSONB)

    product: Mapped[Product] = relationship(back_populates="variants")
    inventory: Mapped[Optional["Inventory"]] = relationship(back_populates="variant", uselist=False)


class Inventory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "inventory"

    variant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("product_variants.id"), index=True, unique=True)
    on_hand: Mapped[int] = mapped_column(Integer, default=0)
    reserved: Mapped[int] = mapped_column(Integer, default=0)

    variant: Mapped[ProductVariant] = relationship(back_populates="inventory")
