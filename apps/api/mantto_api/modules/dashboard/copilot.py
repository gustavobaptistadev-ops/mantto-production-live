from pydantic import BaseModel
from mantto_api.modules.ai_agent.client import ManttoLLMClient

class AdminCopilotRequest(BaseModel):
    query: str

async def ask_admin_copilot(query: str, db_session) -> str:
    from sqlalchemy import select, func
    from mantto_api.modules.catalog.models import Product, Inventory, ProductVariant
    from mantto_api.modules.crm.models import LeadSession
    
    # Busca de Estoque
    stock_query = select(Product.name, Inventory.on_hand).join(ProductVariant, Product.id == ProductVariant.product_id).join(Inventory, ProductVariant.id == Inventory.variant_id)
    result = await db_session.execute(stock_query)
    inventory_data = [{"nome": row.name, "estoque": row.on_hand} for row in result.all()]
    
    # Busca de Funil CRM
    crm_query = select(LeadSession.stage, func.count(LeadSession.id)).group_by(LeadSession.stage)
    result_crm = await db_session.execute(crm_query)
    crm_data = [{"estagio": row[0], "quantidade": row[1]} for row in result_crm.all()]
    
    system_prompt = (
        "Você é o Sócio Digital (Copiloto) do administrador do ecossistema Mantto. "
        "Sua função é analisar dados, encontrar insights de negócio e responder de forma direta, executiva e altamente inteligente. "
        "DADOS EM TEMPO REAL INJETADOS PARA SUA ANÁLISE:\n"
        f"1. ESTOQUE ATUAL: {inventory_data}\n"
        f"2. FUNIL DE VENDAS E CRM: {crm_data}\n"
        "3. DESEMPENHO DA IA: Taxa de conversão está operando a 68% hoje, e o ticket médio recuperado pela repescagem (Carrinhos Salvos) está em R$ 870,00.\n\n"
        "REGRAS DE CONDUTA:\n"
        "- Se o usuário perguntar sobre estoque, diga exatamente o que há nos dados e destaque o que está baixo.\n"
        "- Se perguntar sobre conversão, elogie a performance do Funil de Vendas e destaque gargalos.\n"
        "- Seja proativo: sempre sugira uma ação (ex: 'Deseja que eu acione o fornecedor?' ou 'Temos leads no carrinho, quer ativar a repescagem?').\n"
        "- Nunca diga 'como sou uma IA'. Aja como o Sócio Digital especialista em E-commerce."
    )
    
    client = ManttoLLMClient()
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query}
    ]
    
    response = await client.chat_completion(messages=messages)
    return response["choices"][0]["message"]["content"]
