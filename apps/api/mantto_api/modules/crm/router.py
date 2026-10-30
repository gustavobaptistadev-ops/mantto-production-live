from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from datetime import datetime

from mantto_api.database import get_db_session
from mantto_api.modules.crm.models import LeadSession, ChatMessage

router = APIRouter(prefix="/crm", tags=["CRM & Pipeline"])

class ToggleHandoffRequest(BaseModel):
    whatsapp_number: str
    take_over: bool  # True = assumido por humano; False = devolvido para IA

class MoveStageRequest(BaseModel):
    whatsapp_number: str
    new_stage: str

@router.get("/pipeline")
async def get_pipeline_leads(db: AsyncSession = Depends(get_db_session)):
    """Retorna todos os leads agrupados para o Kanban do vendedor/administrador."""
    query = select(LeadSession).order_by(LeadSession.last_interaction.desc())
    result = await db.execute(query)
    leads = result.scalars().all()
    
    stages = {
        "NOVO": [],
        "CATALOGO_VISUALIZADO": [],
        "VTON_PROVADO": [],
        "CARRINHO_CRIADO": [],
        "PAGO": [],
        "DESISTENCIA": []
    }
    
    for lead in leads:
        lead_dict = {
            "id": str(lead.id),
            "whatsapp_number": lead.whatsapp_number,
            "customer_name": lead.customer_name or "Torcedor",
            "favorite_club": lead.favorite_club or "N/D",
            "preferred_size": lead.preferred_size or "M",
            "stage": lead.stage,
            "sentiment": lead.sentiment,
            "needs_human_intervention": lead.needs_human_intervention,
            "total_value_cents": lead.total_value_cents,
            "last_interaction": lead.last_interaction.isoformat() if lead.last_interaction else None
        }
        if lead.stage in stages:
            stages[lead.stage].append(lead_dict)
        else:
            stages["NOVO"].append(lead_dict)
            
    return {"pipeline": stages, "total_leads": len(leads)}

@router.post("/handoff")
async def toggle_human_handoff(payload: ToggleHandoffRequest, db: AsyncSession = Depends(get_db_session)):
    """Assume ou devolve o atendimento para a IA."""
    result = await db.execute(select(LeadSession).where(LeadSession.whatsapp_number == payload.whatsapp_number))
    lead = result.scalars().first()
    if not lead:
        lead = LeadSession(
            whatsapp_number=payload.whatsapp_number,
            needs_human_intervention=payload.take_over
        )
        db.add(lead)
    else:
        lead.needs_human_intervention = payload.take_over
        
    await db.commit()
    status_str = "HUMANO (Assumido)" if payload.take_over else "IA (Automático)"
    return {
        "status": "success",
        "whatsapp_number": payload.whatsapp_number,
        "controlled_by": status_str
    }

@router.post("/stage")
async def move_lead_stage(payload: MoveStageRequest, db: AsyncSession = Depends(get_db_session)):
    """Move manualmente o lead entre os estágios do funil."""
    result = await db.execute(select(LeadSession).where(LeadSession.whatsapp_number == payload.whatsapp_number))
    lead = result.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
        
    lead.stage = payload.new_stage
    lead.last_interaction = datetime.utcnow()
    await db.commit()
    return {"status": "success", "new_stage": payload.new_stage}

@router.get("/chat-history/{whatsapp_number}")
async def get_chat_history(whatsapp_number: str, db: AsyncSession = Depends(get_db_session)):
    """Retorna as mensagens em ordem cronológica para exibição no chat lateral do CRM."""
    query = (
        select(ChatMessage)
        .where(ChatMessage.whatsapp_number == whatsapp_number)
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
    )
    result = await db.execute(query)
    messages = result.scalars().all()
    
    return [
        {
            "id": str(m.id),
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]
