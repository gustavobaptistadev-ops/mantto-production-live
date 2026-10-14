import os
import httpx
import logging

logger = logging.getLogger(__name__)

class WhatsAppCloudClient:
    """Cliente oficial para envio de mensagens via Meta WhatsApp Cloud API."""

    def __init__(self):
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_ID", "")
        self.access_token = os.getenv("WHATSAPP_API_TOKEN", "")
        self.api_version = os.getenv("WHATSAPP_API_VERSION", "v21.0")
        self.base_url = f"https://graph.facebook.com/{self.api_version}"

    @property
    def is_configured(self) -> bool:
        return bool(self.phone_number_id and self.access_token)

    async def send_text_message(self, to_number: str, text: str) -> dict:
        """Envia uma mensagem de texto simples para um número de WhatsApp."""
        if not self.is_configured:
            logger.warning("[WhatsAppClient] WHATSAPP_PHONE_ID ou WHATSAPP_API_TOKEN não configurados. Modo Simulado.")
            return {"status": "simulated", "to": to_number, "text": text}

        url = f"{self.base_url}/{self.phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to_number,
            "type": "text",
            "text": {
                "preview_url": True,
                "body": text
            }
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"[WhatsAppClient] Erro HTTP da Meta ({e.response.status_code}): {e.response.text}")
                return {"status": "error", "code": e.response.status_code, "detail": e.response.text}
            except Exception as e:
                logger.error(f"[WhatsAppClient] Falha de conexão ao enviar WhatsApp: {str(e)}")
                return {"status": "error", "detail": str(e)}

    async def send_image_message(self, to_number: str, image_url: str, caption: str = "") -> dict:
        """Envia uma imagem (ex: Provador Virtual VTON gerado) com legenda para o cliente."""
        if not self.is_configured:
            logger.warning("[WhatsAppClient] Disparo de imagem simulado (sem credenciais).")
            return {"status": "simulated", "to": to_number, "image_url": image_url, "caption": caption}

        url = f"{self.base_url}/{self.phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to_number,
            "type": "image",
            "image": {
                "link": image_url,
                "caption": caption
            }
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"[WhatsAppClient] Falha ao enviar imagem WhatsApp: {str(e)}")
                return {"status": "error", "detail": str(e)}

whatsapp_client = WhatsAppCloudClient()
