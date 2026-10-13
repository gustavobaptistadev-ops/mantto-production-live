from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import random

from mantto_api.database import get_db_session
from mantto_api.modules.catalog.models import Product, Inventory, ProductVariant
from mantto_api.modules.orders.models import Order
from mantto_api.modules.dashboard.copilot import AdminCopilotRequest, ask_admin_copilot

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.post("/copilot")
async def chat_with_copilot(payload: AdminCopilotRequest, db: AsyncSession = Depends(get_db_session)):
    response = await ask_admin_copilot(payload.query, db)
    return {"reply": response}

@router.get("/metrics")
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db_session)):
    # 1. Total de vendas (Mock ou Real dependendo se ha orders)
    # 2. Produtos com alerta de estoque
    # 3. Top Vendas
    
    # Busca alertas de estoque (on_hand <= 5)
    stock_query = select(Product.name, Inventory.on_hand).join(ProductVariant, Product.id == ProductVariant.product_id).join(Inventory, ProductVariant.id == Inventory.variant_id).where(Inventory.on_hand <= 5)
    stock_result = await db.execute(stock_query)
    low_stock = [{"name": row.name, "stock": row.on_hand} for row in stock_result.all()]
    
    # Mockando mÃƒÂ©tricas que requerem tempo para acumular (IA conversion)
    metrics = {
        "sales_today_cents": 425000, # R$ 4.250,00
        "sales_growth": "+12%",
        "ai_conversion_rate": 68,
        "rescued_carts_cents": 87000, "pending_human_tickets": 2, # R$ 870,00
        "low_stock_alerts": low_stock,
        "top_products": [
            {"name": "Camisa Flamengo 2026", "sales": 85, "percent": 85},
            {"name": "CalÃƒÂ§ÃƒÂ£o Flamengo", "sales": 60, "percent": 60},
            {"name": "Real Madrid Home", "sales": 45, "percent": 45}
        ],
        "active_orders": [
            {"customer": "Marcos Silva", "phone": "11 99999-1234", "item": "Kit Real Madrid (G)", "status": "Separando"},
            {"customer": "Rafael Souza", "phone": "21 98888-5678", "item": "Camisa Vasco RetrÃƒÂ´ (M)", "status": "Enviado"}
        ]
    }
    
    return metrics
