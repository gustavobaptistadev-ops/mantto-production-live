import os
import time
import asyncio
import httpx
from typing import Protocol

class VirtualTryOnProvider(Protocol):
    async def generate_tryon(self, person_image_url: str, garment_image_url: str) -> str:
        ...

class DummyReplicateVTON(VirtualTryOnProvider):
    async def generate_tryon(self, person_image_url: str, garment_image_url: str) -> str:
        print("[VTON] Processando Mock...")
        return "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=600&auto=format&fit=crop"

class RealReplicateVTON(VirtualTryOnProvider):
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    async def generate_tryon(self, person_image_url: str, garment_image_url: str) -> str:
        print(f"[VTON REAL] Iniciando difusÃ£o no Replicate. Pessoa: {person_image_url[:30]}...")
        
        # Usando o modelo IDM-VTON (State-of-the-Art open source para Try-On)
        payload = {
            "version": "c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b6d021d3ff4", # VersÃ£o oficial do yisol/idm-vton
            "input": {
                "human_image": person_image_url,
                "garment_image": garment_image_url,
                "garment_des": "clothes",
                "is_checked": True,
                "is_checked_crop": False,
                "denoise_steps": 30,
                "seed": 42
            }
        }
        
        async with httpx.AsyncClient() as client:
            # 1. Cria a prediÃ§Ã£o na GPU
            response = await client.post("https://api.replicate.com/v1/predictions", headers=self.headers, json=payload)
            response.raise_for_status()
            prediction = response.json()
            
            get_url = prediction["urls"]["get"]
            
            # 2. Polling (Aguardando a GPU terminar o processamento ~10s)
            for _ in range(30):
                await asyncio.sleep(2)
                poll_resp = await client.get(get_url, headers=self.headers)
                poll_resp.raise_for_status()
                status_data = poll_resp.json()
                
                if status_data["status"] == "succeeded":
                    return status_data["output"]
                elif status_data["status"] == "failed":
                    raise Exception("A GPU falhou ao gerar a imagem no Replicate.")
                    
            raise Exception("Timeout na geraÃ§Ã£o da imagem (demorou mais de 60 segundos).")

def get_vton_provider() -> VirtualTryOnProvider:
    token = os.getenv("REPLICATE_API_TOKEN")
    if token:
        return RealReplicateVTON(api_token=token)
    return DummyReplicateVTON()
