from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from datetime import datetime

from mantto_api.database import get_db_session
from mantto_api.modules.crm.models import LeadSession

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
        "CARRINHO_CRIADO": [],
        "PAGO": [],
        "DESISTENCIA": []
    }
    
    for lead in leads:
        lead_dict = {
            "id": str(lead.id),
            "whatsapp_number": lead.whatsapp_number,
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
        # Se o lead não existir, cria um novo
        lead = LeadSession(
            whatsapp_number=payload.whatsapp_number,
            needs_human_intervention=payload.take_over
        )
        db.add(lead)
    else:
        lead.needs_human_intervention = payload.take_over
        lead.last_interaction = datetime.utcnow()
        
    await db.commit()
    status_label = "Humano assumiu o atendimento" if payload.take_over else "Atendimento devolvido com sucesso para a IA"
    return {"status": "ok", "message": status_label, "needs_human_intervention": lead.needs_human_intervention}

@router.post("/move-stage")
async def move_lead_stage(payload: MoveStageRequest, db: AsyncSession = Depends(get_db_session)):
    """Move um card manualmente no Kanban."""
    result = await db.execute(select(LeadSession).where(LeadSession.whatsapp_number == payload.whatsapp_number))
    lead = result.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
        
    lead.stage = payload.new_stage
    lead.last_interaction = datetime.utcnow()
    await db.commit()
    return {"status": "ok", "new_stage": lead.stage}
