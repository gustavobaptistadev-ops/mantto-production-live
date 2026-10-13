from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import json

from mantto_api.database import get_db_session
from mantto_api.modules.ai_agent.client import ManttoLLMClient
from mantto_api.modules.ai_agent.tools import registry

router = APIRouter(prefix="/ai", tags=["AI Agent"])

class ChatRequest(BaseModel):
    message: str
    conversation_history: list[dict] = []
    context: dict = {}

class ChatResponse(BaseModel):
    reply: str
    tools_called: list[str] = []

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(payload: ChatRequest, db: AsyncSession = Depends(get_db_session)):
    from mantto_api.modules.settings.models import SystemSettings
    from sqlalchemy import select
    
    result = await db.execute(select(SystemSettings).where(SystemSettings.id == 1))
    settings_db = result.scalars().first()
    
    client = ManttoLLMClient(
        base_url=settings_db.llm_base_url if settings_db else None,
        api_key=settings_db.llm_api_key if settings_db else None,
        model=settings_db.llm_model if settings_db else None,
    )
    
    messages = payload.conversation_history + [{"role": "user", "content": payload.message}]
    tools_def = registry.get_definitions()
    
    # 1. First call to LLM
    response_data = await client.chat_completion(messages=messages, tools=tools_def)
    
    message = response_data["choices"][0]["message"]
    tools_called = []
    
    # 2. Process Tool Calls if any
    if "tool_calls" in message and message["tool_calls"]:
        messages.append(message)
        
        for tool_call in message["tool_calls"]:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            
            tools_called.append(func_name)
            
            # Execute tool locally securely with RBAC Context
            try:
                tool_result = await registry.execute(func_name, arguments, db_session=db, context=payload.context)
                result_str = json.dumps(tool_result)
            except Exception as e:
                result_str = json.dumps({"error": str(e)})
                
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call["id"],
                "content": result_str
            })
            
        # 3. Second call to LLM with tool results
        final_response_data = await client.chat_completion(messages=messages, tools=tools_def)
        final_reply = final_response_data["choices"][0]["message"]["content"]
        
        return ChatResponse(reply=final_reply, tools_called=tools_called)
    
    return ChatResponse(reply=message.get("content", ""), tools_called=[])
