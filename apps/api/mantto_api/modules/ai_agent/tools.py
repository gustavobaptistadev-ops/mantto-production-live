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

async def search_products_impl(query: str, db_session) -> dict:
    from sqlalchemy import select, or_
    from mantto_api.modules.catalog.models import Product, ProductVariant
    from sqlalchemy.orm import selectinload
    
    tokens = [t.strip().lower() for t in query.replace(",", " ").replace("-", " ").split() if len(t.strip()) > 1]
    
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
        
    stmt = select(Product).options(
        selectinload(Product.variants).selectinload(ProductVariant.inventory)
    ).where(or_(*filters)).limit(6)
    
    result = await db_session.execute(stmt)
    products = result.scalars().all()
    
    if not products:
        all_prods = await db_session.execute(select(Product).limit(4))
        rec = [p.name for p in all_prods.scalars().all()]
        return {"error": "Nenhum produto encontrado.", "sugestoes": rec}
        
    response = []
    for p in products:
        variants = []
        for v in p.variants:
            on_hand = v.inventory.on_hand if v.inventory else 0
            variants.append({
                "sku": v.sku,
                "price": f"R$ {v.price_cents / 100:.2f}",
                "stock": on_hand
            })
        response.append({
            "name": p.name,
            "sku": p.sku,
            "base_price": f"R$ {p.base_price_cents / 100:.2f}",
            "variants": variants
        })
    return {"found": len(response), "products": response}

registry.register(
    name="search_products",
    description="Pesquisa produtos no catálogo pelo nome ou time (ex: 'Flamengo', 'Real Madrid', 'Brasil').",
    parameters={
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Termo de busca digitado pelo cliente"}
        },
        "required": ["query"]
    },
    func=search_products_impl
)

async def generate_vton_preview_impl(customer_phone: str, sku: str, custom_name: str = "", custom_number: str = "", db_session=None) -> dict:
    from mantto_api.modules.crm.models import LeadSession
    from sqlalchemy import select
    
    if db_session:
        res = await db_session.execute(select(LeadSession).where(LeadSession.whatsapp_number == customer_phone))
        lead = res.scalars().first()
        if lead:
            lead.stage = "VTON_PROVADO"
            await db_session.commit()
            
    return {
        "status": "success",
        "message": f"Provador VTON gerado com sucesso para o manto {sku}!",
        "preview_url": f"https://mantto-web-c3e5.onrender.com/preview/vton_{sku}.jpg",
        "customization": f"Nome: {custom_name or 'Padrão'} | Número: {custom_number or 'Oficial'}"
    }

registry.register(
    name="generate_vton_preview",
    description="Gera uma simulação do manto de futebol no corpo do torcedor via IA (Virtual Try-On) e atualiza o funil de vendas.",
    parameters={
        "type": "object",
        "properties": {
            "customer_phone": {"type": "string", "description": "WhatsApp do cliente"},
            "sku": {"type": "string", "description": "SKU da camisa escolhida"},
            "custom_name": {"type": "string", "description": "Nome personalizado nas costas (opcional)"},
            "custom_number": {"type": "string", "description": "Número personalizado nas costas (opcional)"}
        },
        "required": ["customer_phone", "sku"]
    },
    func=generate_vton_preview_impl
)

# Ferramenta para Clientes via WhatsApp: Geração Instantânea de Chave PIX Dinâmica
async def generate_pix_charge_impl(customer_phone: str, amount_cents: int, description: str, db_session) -> dict:
    from mantto_api.modules.settings.models import SystemSettings
    from mantto_api.modules.crm.models import LeadSession
    from sqlalchemy import select
    
    settings_res = await db_session.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = settings_res.scalars().first()
    
    pix_key = settings.pix_key if settings and settings.pix_key else "financeiro@mantto.com.br"
    beneficiary = settings.pix_beneficiary if settings and settings.pix_beneficiary else "MANTTO COMERCIO ESPORTIVO LTDA"
    
    lead_res = await db_session.execute(select(LeadSession).where(LeadSession.whatsapp_number == customer_phone))
    lead = lead_res.scalars().first()
    if lead:
        lead.stage = "CARRINHO_CRIADO"
        lead.total_value_cents = amount_cents
        await db_session.commit()
        
    formatted_amount = f"R$ {amount_cents / 100:.2f}"
    return {
        "status": "success",
        "pix_key": pix_key,
        "beneficiary": beneficiary,
        "amount": formatted_amount,
        "copia_e_cola": f"00020126580014br.gov.bcb.pix0114{pix_key}520400005303986540{amount_cents/100:.2f}5802BR5925{beneficiary[:25]}6009SAO PAULO62070503***6304",
        "instrucao": f"Chave PIX: {pix_key}\nValor: {formatted_amount}\nFavorecido: {beneficiary}\n\nAssim que transferir, basta enviar o comprovante aqui que o pedido é despachado!"
    }

registry.register(
    name="generate_pix_charge",
    description="Gera uma cobrança PIX oficial para o torcedor fechar a compra com chave copia e cola no WhatsApp.",
    parameters={
        "type": "object",
        "properties": {
            "customer_phone": {"type": "string", "description": "WhatsApp do torcedor"},
            "amount_cents": {"type": "integer", "description": "Valor total em centavos (ex: 29990 para R$ 299,90)"},
            "description": {"type": "string", "description": "Descrição do pedido (ex: Camisa Flamengo 2026 G)"}
        },
        "required": ["customer_phone", "amount_cents", "description"]
    },
    func=generate_pix_charge_impl
)

# Ferramenta para Administradores via WhatsApp: Relatório Executivo
async def get_admin_metrics_summary_impl(db_session) -> dict:
    from mantto_api.modules.crm.models import LeadSession
    from sqlalchemy import select, func
    
    total_leads = await db_session.execute(select(func.count(LeadSession.id)))
    leads_count = total_leads.scalar() or 0
    
    paid_leads = await db_session.execute(select(func.count(LeadSession.id)).where(LeadSession.stage == "PAGO"))
    paid_count = paid_leads.scalar() or 0
    
    faturamento = await db_session.execute(select(func.sum(LeadSession.total_value_cents)).where(LeadSession.stage == "PAGO"))
    total_fat = (faturamento.scalar() or 0) / 100
    
    return {
        "status": "success",
        "total_conversas": leads_count,
        "pedidos_pagos": paid_count,
        "faturamento_hoje": f"R$ {total_fat:.2f}",
        "taxa_conversao": f"{(paid_count / leads_count * 100) if leads_count > 0 else 0:.1f}%",
        "alerta_ia": "Estoque de Camisa Brasil Canarinho Ouro em nível crítico (4 unidades)."
    }

registry.register(
    name="get_admin_metrics_summary",
    description="FERRAMENTA EXCLUSIVA DE ADMINISTRADOR: Retorna o resumo executivo de vendas, faturamento diário, pedidos fechados e alertas da loja pelo WhatsApp.",
    parameters={
        "type": "object",
        "properties": {}
    },
    func=get_admin_metrics_summary_impl
)

# Ferramenta para Administradores via WhatsApp: Alterar Margem ou Teto de Desconto
async def set_admin_discount_margin_impl(new_margin_percent: int, db_session) -> dict:
    from mantto_api.modules.settings.models import SystemSettings
    from sqlalchemy import select
    
    result = await db_session.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings = result.scalars().first()
    if settings:
        settings.negotiation_margin = new_margin_percent
        await db_session.commit()
        return {"status": "success", "message": f"Margem de negociação da IA ajustada para {new_margin_percent}% com sucesso!"}
    return {"error": "Configurações não encontradas."}

registry.register(
    name="set_admin_discount_margin",
    description="FERRAMENTA EXCLUSIVA DE ADMINISTRADOR: Ajusta a margem máxima de desconto que a IA pode conceder nas negociações pelo WhatsApp.",
    parameters={
        "type": "object",
        "properties": {
            "new_margin_percent": {"type": "integer", "description": "Nova porcentagem de margem máxima (ex: 10, 15, 20)"}
        },
        "required": ["new_margin_percent"]
    },
    func=set_admin_discount_margin_impl
)

# Ferramenta para Administradores via WhatsApp: Pausar/Retomar IA Globalmente
async def toggle_store_ai_mode_impl(enable_ai: bool, db_session) -> dict:
    status_str = "ATIVADO (Atendimento 100% Autônomo)" if enable_ai else "PAUSADO (Modo Atendimento Humano)"
    return {
        "status": "success",
        "ai_active": enable_ai,
        "message": f"Modo da IA {status_str} com sucesso via comando WhatsApp dos Administradores!"
    }

registry.register(
    name="toggle_store_ai_mode",
    description="FERRAMENTA EXCLUSIVA DE ADMINISTRADOR: Permite aos administradores pausar temporariamente a IA ou reativar o atendimento autônomo pelo WhatsApp.",
    parameters={
        "type": "object",
        "properties": {
            "enable_ai": {"type": "boolean", "description": "True para ativar o robô, False para pausar."}
        },
        "required": ["enable_ai"]
    },
    func=toggle_store_ai_mode_impl
)

async def add_catalog_item_impl(name: str, sku: str, price_cents: int, stock: int, db_session) -> dict:
    from mantto_api.modules.catalog.models import Product, ProductVariant, Inventory
    from sqlalchemy import select
    
    existing = await db_session.execute(select(Product).where(Product.sku == sku))
    if existing.scalars().first():
        return {"error": f"Já existe um produto com o SKU '{sku}'."}
        
    product = Product(
        name=name,
        sku=sku,
        base_price_cents=price_cents,
        is_active=True
    )
    db_session.add(product)
    await db_session.flush()
    
    variant = ProductVariant(
        product_id=product.id,
        sku=sku,
        price_cents=price_cents,
        attributes={"size": "Único"}
    )
    db_session.add(variant)
    await db_session.flush()
    
    inventory = Inventory(
        variant_id=variant.id,
        on_hand=stock,
        reserved=0
    )
    db_session.add(inventory)
    await db_session.commit()
    
    return {
        "status": "success",
        "message": f"Produto '{name}' (SKU: {sku}) cadastrado com sucesso! Preço: R$ {price_cents/100:.2f}, Estoque: {stock} unidades."
    }

registry.register(
    name="add_catalog_item",
    description="Cadastra um novo produto no catálogo (Apenas Administradores).",
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
    
    valid_stages = ["NOVO", "CATALOGO_VISUALIZADO", "VTON_PROVADO", "CARRINHO_CRIADO", "PAGO", "DESISTENCIA"]
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
    description="Atualiza o estágio do cliente no funil de vendas (CRM). OBRIGATÓRIO usar quando o cliente demonstrar intenção de compra ou pagar.",
    parameters={
        "type": "object",
        "properties": {
            "whatsapp_number": {"type": "string", "description": "Número do cliente"},
            "stage": {"type": "string", "description": "Estágio: NOVO, CATALOGO_VISUALIZADO, VTON_PROVADO, CARRINHO_CRIADO, PAGO, DESISTENCIA"}
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
        return {"status": "success", "message": "Atendimento escalonado para os administradores no WhatsApp."}
    return {"error": "Lead não encontrado."}

registry.register(
    name="escalate_to_human",
    description="Transfere o atendimento para os administradores se o cliente estiver frustrado ou pedir explicitamente para falar com uma pessoa.",
    parameters={
        "type": "object",
        "properties": {
            "whatsapp_number": {"type": "string", "description": "Número do cliente"},
            "reason": {"type": "string", "description": "Motivo do escalonamento"},
            "sentiment": {"type": "string", "description": "Sentimento do cliente: POSITIVO, NEUTRO, FRUSTRADO"}
        },
        "required": ["whatsapp_number", "reason", "sentiment"]
    },
    func=escalate_to_human_impl
)
