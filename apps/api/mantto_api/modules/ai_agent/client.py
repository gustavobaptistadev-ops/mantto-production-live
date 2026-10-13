import httpx
from mantto_api.config import get_settings

class ManttoLLMClient:
    def __init__(self, base_url: str = None, api_key: str = None, model: str = None):
        settings = get_settings()
        self.base_url = base_url or settings.llm_base_url
        
        # Resolve API key
        if api_key:
            self.api_key = api_key
        elif settings.llm_api_key:
            self.api_key = settings.llm_api_key.get_secret_value()
        else:
            self.api_key = "dummy-key-for-local"
            
        self.model = model or settings.llm_model or "gpt-4o-mini"
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def chat_completion(self, messages: list[dict], tools: list[dict] = None) -> dict:
        """
        Calls an OpenAI-compatible /v1/chat/completions endpoint.
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2
        }
        
        if tools:
            payload["tools"] = tools

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url.rstrip('/')}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            return response.json()
