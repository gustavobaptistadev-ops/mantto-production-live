import json
from typing import Any, Callable

class AIToolRegistry:
    def __init__(self):
        self._tools = {}
        self._definitions = []

    def register(self, name: str, description: str, parameters: dict, func: Callable):
        self._tools[name] = func
        self._definitions.append({
            "type": "function",
            "function": {
                "name": name,
                "description": description,
                "parameters": parameters
            }
        })

    def get_definitions(self) -> list[dict]:
        return self._definitions

    async def execute(self, name: str, arguments: dict, **kwargs) -> Any:
        if name not in self._tools:
            raise ValueError(f"Tool {name} is not registered.")
        return await self._tools[name](**arguments, **kwargs)

registry = AIToolRegistry()

# -----------------
# Built-in Tools
# -----------------

def get_inventory_tool() -> dict:
    return {
        "type": "function",
        "function": {
            "name": "check_inventory",
            "description": "Verifica o estoque disponível e reservado para um determinado SKU.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sku": {"type": "string", "description": "Código SKU do produto/variação."}
                },
                "required": ["sku"]
            }
        }
    }

async def check_inventory_impl(sku: str, db_session) -> dict:
    from sqlalchemy import select
    from mantto_api.modules.catalog.models import Inventory, ProductVariant
    
    result = await db_session.execute(
        select(Inventory).join(ProductVariant).where(ProductVariant.sku == sku)
    )
    inv = result.scalars().first()
    if not inv:
        return {"error": "SKU não encontrado no sistema."}
    return {"on_hand": inv.on_hand, "reserved": inv.reserved}

async def search_products_impl(query: str, db_session) -> dict:
    from sqlalchemy import select, or_, and_
    from mantto_api.modules.catalog.models import Product, ProductVariant, Inventory
    from sqlalchemy.orm import selectinload
    
    # 1. Pré-processamento e Normalização (Pattern RAG E-commerce)
    tokens = [t.strip().lower() for t in query.replace(",", " ").replace("-", " ").split() if len(t.strip()) > 1]
    
    # Mapeamento semântico de sinônimos de torcida/futebol
    synonyms = {
        "manto": "camisa",
        "mengao": "flamengo",
        "fla": "flamengo",
        "timao": "corinthians",
        "verdao": "palmeiras",
        "tricolor": "sao paulo",
        "ouro": "amarela",
        "uniforme": "camisa"
    }
    expanded_tokens = []
    for token in tokens:
        expanded_tokens.append(token)
        if token in synonyms:
            expanded_tokens.append(synonyms[token])
            
    filters = []
    for t in set(expanded_tokens):
        filters.append(Product.name.ilike(f"%{t}%"))
        filters.append(Product.sku.ilike(f"%{t}%"))
        
    # Busca com filtro flexível (OR entre tokens expandidos)
    stmt = select(Product).options(
        selectinload(Product.variants).selectinload(ProductVariant.inventory)
    ).where(or_(*filters)).limit(6)
    
    result = await db_session.execute(stmt)
    products = result.scalars().all()
    
    if not products:
        # Fallback inteligente: trazer as peças mais buscadas em destaque
        fallback_stmt = select(Product).options(
            selectinload(Product.variants).selectinload(ProductVariant.inventory)
        ).limit(3)
        res_fallback = await db_session.execute(fallback_stmt)
        products = res_fallback.scalars().all()
        return {
            "status": "Aviso",
            "mensagem": f"Não encontrei exatamente '{query}', mas temos estas camisas oficiais disponíveis no estoque:",
            "destaques": [
                {
                    "sku": p.sku,
                    "nome": p.name,
                    "preco_reais": f"R$ {p.price / 100:.2f}",
                    "tamanhos_disponiveis": [
                        f"{v.name} (Estoque: {v.inventory.on_hand if v.inventory else 10})"
                        for v in p.variants
                    ]
                } for p in products
            ]
        }
    
    data = []
    for p in products:
        variants_info = []
        for v in p.variants:
            stock = v.inventory.on_hand if v.inventory else 0
            variants_info.append(f"{v.name} (Estoque: {stock} un)")
            
        data.append({
            "sku": p.sku,
            "nome": p.name,
            "preco_reais": f"R$ {p.price / 100:.2f}",
            "grade_tamanhos": variants_info,
            "suporta_provador_vton": True
        })
        
    return {
        "status": "Sucesso",
        "total_encontrado": len(data),
        "produtos": data
    }

registry.register(
    name="search_products",
    description="Busca produtos no banco de dados pelo nome (ex: 'Flamengo', 'CalÃ§Ã£o'). OBRIGATÃ“RIO usar antes de confirmar qualquer venda.",
    parameters={
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Termo de busca (ex: 'camisa flamengo')"}
        },
        "required": ["query"]
    },
    func=search_products_impl
)

async def list_products_impl(db_session) -> dict:
    from sqlalchemy import select
    from mantto_api.modules.catalog.models import Product
    from sqlalchemy.orm import selectinload
    
    result = await db_session.execute(select(Product).options(selectinload(Product.variants)).limit(10))
    products = result.scalars().all()
    
    data = []
    for p in products:
        data.append({
            "sku": p.sku,
            "name": p.name,
            "price_cents": p.price,
            "variants": [{"sku": v.sku, "name": v.name} for v in p.variants]
        })
    return {"products": data}

async def get_order_status_impl(customer_ref: str, db_session) -> dict:
    from sqlalchemy import select
    from mantto_api.modules.orders.models import Order
    
    result = await db_session.execute(select(Order).where(Order.customer_ref == customer_ref).order_by(Order.created_at.desc()))
    order = result.scalars().first()
    if not order:
        return {"error": "Nenhum pedido encontrado para esta referência."}
    return {"order_id": str(order.id), "status": order.status, "total_cents": order.total_cents}

registry.register(
    name="check_inventory",
    description="Verifica o estoque disponível e reservado para um determinado SKU.",
    parameters={
        "type": "object",
        "properties": {
            "sku": {"type": "string", "description": "Código SKU do produto/variação."}
        },
        "required": ["sku"]
    },
    func=check_inventory_impl
)

registry.register(
    name="list_products",
    description="Lista os produtos disponíveis no catálogo com seus SKUs e preços base em centavos.",
    parameters={"type": "object", "properties": {}},
    func=list_products_impl
)

registry.register(
    name="get_order_status",
    description="Busca o status do pedido mais recente de um cliente baseado na sua referência (telefone ou email).",
    parameters={
        "type": "object",
        "properties": {
            "customer_ref": {"type": "string", "description": "Referência do cliente (telefone ou email)"}
        },
        "required": ["customer_ref"]
    },
    func=get_order_status_impl
)

async def add_catalog_item_impl(name: str, sku: str, price_cents: int, stock: int, db_session, context: dict = None) -> dict:
    # 0. RBAC Security Check
    if not context or not context.get("is_admin"):
        return {"error": "ERRO DE SEGURANÇA: Acesso negado. Apenas o administrador do sistema tem privilégios para executar esta função."}
        
    from mantto_api.modules.catalog.models import Product, ProductVariant, Inventory
    from sqlalchemy import select
    
    # Check if exists
    result = await db_session.execute(select(Product).where(Product.sku == sku))
    if result.scalars().first():
        return {"error": "SKU já existe no catálogo."}
        
    new_prod = Product(name=name, description="Adicionado via WhatsApp Admin", price=price_cents, sku=sku)
    db_session.add(new_prod)
    await db_session.flush()
    
    new_var = ProductVariant(product_id=new_prod.id, name="Padrão", sku=sku)
    db_session.add(new_var)
    await db_session.flush()
    
    new_inv = Inventory(variant_id=new_var.id, on_hand=stock, reserved=0)
    db_session.add(new_inv)
    await db_session.commit()
    
    return {"status": "success", "message": f"Produto {name} ({sku}) adicionado com {stock} itens em estoque!"}

registry.register(
    name="add_catalog_item",
    description="Adiciona um novo produto ao catálogo e inicializa seu estoque. USO RESTRITO PARA ADMIN.",
    parameters={
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Nome do produto"},
            "sku": {"type": "string", "description": "Código SKU (único)"},
            "price_cents": {"type": "integer", "description": "Preço em centavos"},
            "stock": {"type": "integer", "description": "Quantidade inicial no estoque"}
        },
        "required": ["name", "sku", "price_cents", "stock"]
    },
    func=add_catalog_item_impl
)

async def update_lead_stage_impl(whatsapp_number: str, stage: str, db_session) -> dict:
    from mantto_api.modules.crm.models import LeadSession
    from sqlalchemy import select
    from datetime import datetime
    
    valid_stages = ["NOVO", "CATALOGO_VISUALIZADO", "CARRINHO_CRIADO", "PAGO", "DESISTENCIA"]
    if stage not in valid_stages:
        return {"error": f"Estágio inválido. Use um destes: {valid_stages}"}
        
    result = await db_session.execute(select(LeadSession).where(LeadSession.whatsapp_number == whatsapp_number))
    lead = result.scalars().first()
    
    if not lead:
        lead = LeadSession(whatsapp_number=whatsapp_number, stage=stage)
        db_session.add(lead)
    else:
        lead.stage = stage
        lead.last_interaction = datetime.utcnow()
        
    await db_session.commit()
    return {"status": "success", "message": f"Estágio do lead {whatsapp_number} atualizado para {stage}"}

registry.register(
    name="update_lead_stage",
    description="Atualiza o estágio do cliente no funil de vendas (CRM). OBRIGATÓRIO usar quando o cliente demonstrar intenção de compra (CARRINHO_CRIADO) ou pagar (PAGO).",
    parameters={
        "type": "object",
        "properties": {
            "whatsapp_number": {"type": "string", "description": "Número do cliente"},
            "stage": {"type": "string", "description": "Estágio: NOVO, CATALOGO_VISUALIZADO, CARRINHO_CRIADO, PAGO, DESISTENCIA"}
        },
        "required": ["whatsapp_number", "stage"]
    },
    func=update_lead_stage_impl
)

async def escalate_to_human_impl(whatsapp_number: str, reason: str, sentiment: str, db_session) -> dict:
    from mantto_api.modules.crm.models import LeadSession
    from sqlalchemy import select
    
    result = await db_session.execute(select(LeadSession).where(LeadSession.whatsapp_number == whatsapp_number))
    lead = result.scalars().first()
    
    if lead:
        lead.needs_human_intervention = True
        lead.sentiment = sentiment
        await db_session.commit()
        return {"status": "success", "message": "Atendimento escalonado para um humano com sucesso. Informe ao cliente que um humano assumirÃ¡."}
    return {"error": "Lead nÃ£o encontrado."}

registry.register(
    name="escalate_to_human",
    description="Transfere o atendimento para um humano (admin) se o cliente estiver frustrado, fizer uma solicitaÃ§Ã£o complexa demais, ou pedir explicitamente para falar com uma pessoa.",
    parameters={
        "type": "object",
        "properties": {
            "whatsapp_number": {"type": "string", "description": "NÃºmero do cliente"},
            "reason": {"type": "string", "description": "Motivo do escalonamento"},
            "sentiment": {"type": "string", "description": "Sentimento do cliente: POSITIVO, NEUTRO, FRUSTRADO"}
        },
        "required": ["whatsapp_number", "reason", "sentiment"]
    },
    func=escalate_to_human_impl
)
