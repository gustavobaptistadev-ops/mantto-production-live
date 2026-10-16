import os
import httpx
import logging
import asyncio

logger = logging.getLogger(__name__)

class WhatsAppHybridClient:
    """
    Cliente Híbrido de WhatsApp para o MANTTO:
    - Modo 1: Meta Cloud API Oficial (Zero Risco de Banimento, 1.000 chats grátis/mês)
    - Modo 2: Gateway QR-Code (Evolution API / OpenWA com simulação anti-ban de digitação)
    """

    def __init__(self):
        # 1. Configurações Meta Cloud API
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_ID", "")
        self.access_token = os.getenv("WHATSAPP_API_TOKEN", "")
        self.api_version = os.getenv("WHATSAPP_API_VERSION", "v21.0")
        self.meta_url = f"https://graph.facebook.com/{self.api_version}"

        # 2. Configurações Gateway QR-Code (Evolution / OpenWA)
        self.gateway_url = os.getenv("WHATSAPP_GATEWAY_URL", "").rstrip("/") # Ex: http://localhost:8080 ou VPS
        self.gateway_token = os.getenv("WHATSAPP_GATEWAY_TOKEN", "")
        self.gateway_instance = os.getenv("WHATSAPP_GATEWAY_INSTANCE", "mantto-instance")

    @property
    def is_meta_configured(self) -> bool:
        return bool(self.phone_number_id and self.access_token)

    @property
    def is_gateway_configured(self) -> bool:
        return bool(self.gateway_url)

    async def _simulate_human_typing(self, to_number: str, text: str):
        """Protocolo Anti-Banimento: Simula presença de digitação proporcional ao texto."""
        if not self.is_gateway_configured:
            return

        # Calcula delay natural (1.5s a 3.5s) para simular digitação humana
        delay = min(max(len(text) * 0.03, 1.5), 3.5)
        try:
            url = f"{self.gateway_url}/chat/sendPresence/{self.gateway_instance}"
            headers = {"apikey": self.gateway_token, "Content-Type": "application/json"}
            payload = {"number": to_number, "presence": "composing", "delay": int(delay * 1000)}
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(url, json=payload, headers=headers)
        except Exception as e:
            logger.debug(f"[WhatsAppClient] Falha ao enviar presença de digitação: {e}")

        await asyncio.sleep(delay)

    async def send_text_message(self, to_number: str, text: str) -> dict:
        """Envia mensagem de texto chaveando automaticamente entre Meta Oficial e Gateway QR-Code."""
        clean_number = "".join(filter(str.isdigit, to_number))

        # ROTA 1: Meta Cloud API Oficial (Prioridade por segurança e estabilidade)
        if self.is_meta_configured:
            url = f"{self.meta_url}/{self.phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": clean_number,
                "type": "text",
                "text": {"preview_url": True, "body": text}
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                try:
                    response = await client.post(url, json=payload, headers=headers)
                    response.raise_for_status()
                    return {"provider": "meta_official", **response.json()}
                except httpx.HTTPStatusError as e:
                    logger.error(f"[WhatsAppClient] Erro Meta ({e.response.status_code}): {e.response.text}")
                    return {"status": "error", "provider": "meta_official", "detail": e.response.text}

        # ROTA 2: Gateway QR-Code (Evolution API / OpenWA) com Blindagem Anti-Ban
        elif self.is_gateway_configured:
            await self._simulate_human_typing(clean_number, text)
            url = f"{self.gateway_url}/message/sendText/{self.gateway_instance}"
            headers = {
                "apikey": self.gateway_token,
                "Content-Type": "application/json"
            }
            payload = {
                "number": clean_number,
                "options": {"delay": 1200, "presence": "composing"},
                "text": text
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                try:
                    response = await client.post(url, json=payload, headers=headers)
                    response.raise_for_status()
                    return {"provider": "qr_gateway", **response.json()}
                except Exception as e:
                    logger.error(f"[WhatsAppClient] Erro Gateway QR: {e}")
                    return {"status": "error", "provider": "qr_gateway", "detail": str(e)}

        # MODO SIMULADO / DEV (Sem credenciais)
        logger.warning("[WhatsAppClient] Nenhum canal de WhatsApp conectado. Disparo simulado no terminal.")
        return {"status": "simulated", "to": clean_number, "text": text}

    async def send_image_message(self, to_number: str, image_url: str, caption: str = "") -> dict:
        """Envia imagem (Provador Virtual VTON) via canal ativo."""
        clean_number = "".join(filter(str.isdigit, to_number))

        if self.is_meta_configured:
            url = f"{self.meta_url}/{self.phone_number_id}/messages"
            headers = {"Authorization": f"Bearer {self.access_token}", "Content-Type": "application/json"}
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": clean_number,
                "type": "image",
                "image": {"link": image_url, "caption": caption}
            }
            async with httpx.AsyncClient(timeout=20.0) as client:
                try:
                    res = await client.post(url, json=payload, headers=headers)
                    res.raise_for_status()
                    return {"provider": "meta_official", **res.json()}
                except Exception as e:
                    return {"status": "error", "provider": "meta_official", "detail": str(e)}

        elif self.is_gateway_configured:
            url = f"{self.gateway_url}/message/sendMedia/{self.gateway_instance}"
            headers = {"apikey": self.gateway_token, "Content-Type": "application/json"}
            payload = {
                "number": clean_number,
                "mediaMessage": {"mediatype": "image", "caption": caption, "media": image_url}
            }
            async with httpx.AsyncClient(timeout=20.0) as client:
                try:
                    res = await client.post(url, json=payload, headers=headers)
                    res.raise_for_status()
                    return {"provider": "qr_gateway", **res.json()}
                except Exception as e:
                    return {"status": "error", "provider": "qr_gateway", "detail": str(e)}

        return {"status": "simulated", "to": clean_number, "image_url": image_url, "caption": caption}

whatsapp_client = WhatsAppHybridClient()

