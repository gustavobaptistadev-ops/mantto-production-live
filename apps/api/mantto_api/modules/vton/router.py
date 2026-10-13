from fastapi import APIRouter, Depends
from pydantic import BaseModel

from mantto_api.modules.vton.provider import get_vton_provider

router = APIRouter(prefix="/vton", tags=["Virtual Try-On"])

class VTONRequest(BaseModel):
    person_image: str
    garment_image: str

@router.post("/generate")
async def generate_vton_image(payload: VTONRequest):
    provider = get_vton_provider()
    # No futuro, se for upload real, a imagem virÃ¡ como multipart/form-data.
    # Para o MVP em base64 ou URL, payload genÃ©rico atende.
    
    result_url = await provider.generate_tryon(
        person_image_url=payload.person_image,
        garment_image_url=payload.garment_image
    )
    
    return {"status": "success", "result_image_url": result_url}
