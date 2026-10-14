from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from mantto_api.database import get_db_session
from mantto_api.modules.ai_agent.router import chat_with_agent, ChatRequest

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])

import os
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "mantto_secret_token_123")

@router.get("/webhook")
async def verify_whatsapp_webhook(request: Request):
    """VerificaÃ§Ã£o oficial exigida pelo Meta Developers (WhatsApp Cloud API)"""
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    if mode == "subscribe" and token == WHATSAPP_VERIFY_TOKEN:
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(content=challenge)
    return {"error": "Invalid verification token"}

class WhatsAppMessage(BaseModel):
    from_number: str
    body: str

@router.post("/webhook")
async def whatsapp_webhook(payload: dict, request: Request, db: AsyncSession = Depends(get_db_session)):
    # Meta WhatsApp Webhook payload format
    # This is a simplified extraction
    try:
        entry = payload.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])
        
        if not messages:
            return {"status": "ok", "message": "No messages found"}
            
        msg = messages[0]
        from_number = msg.get("from")
        text_body = msg.get("text", {}).get("body", "")
        
        if not text_body:
            return {"status": "ok", "message": "Not a text message"}
            
        # Refactored: Call Service Layer for Domain Logic
        from mantto_api.modules.whatsapp.service import process_incoming_whatsapp_message
        
        domain_context = await process_incoming_whatsapp_message(from_number, text_body, db)
        
        sys_prompt = domain_context["sys_prompt"]
        is_admin = domain_context["is_admin"]
            
        # 1. Fetch conversation history from cache/db based on from_number (skipped in MVP mock)
        history = [
            {"role": "system", "content": f"{sys_prompt} O número atual é {from_number}."}
        ]
        
        # 2. Call AI Agent (with Context Injection for RBAC)
        agent_context = {"is_admin": is_admin}
        ai_req = ChatRequest(message=text_body, conversation_history=history, context=agent_context)
        ai_resp = await chat_with_agent(ai_req, db)
        
        # 3. Disparo ativo para a Meta WhatsApp Cloud API
        from mantto_api.modules.whatsapp.client import whatsapp_client
        send_result = await whatsapp_client.send_text_message(to_number=from_number, text=ai_resp.reply)
        
        return {
            "status": "ok", 
            "reply_sent": ai_resp.reply,
            "delivery": send_result
        }
        
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@router.get("/webhook")
async def verify_webhook(request: Request):
    # Meta webhook verification
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    if mode == "subscribe" and token == "mantto_secret_token":
        return int(challenge)
    return {"status": "error"}
