import pytest_asyncio
import pytest
from httpx import AsyncClient, ASGITransport

from mantto_api.main import app

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client

@pytest.mark.asyncio
async def test_create_product_and_inventory(async_client):
    # 1. Create Tenant
    tenant_resp = await async_client.post("/auth/tenants", json={"name": "Catalog Tenant"})
    tenant_id = tenant_resp.json()["id"]

    import uuid
    uniq = str(uuid.uuid4())[:8]
    sku = f"PROD-{uniq}"
    # 2. Create Product
    prod_payload = {
        "tenant_id": tenant_id,
        "sku": sku,
        "name": "Camiseta Básica",
        "price": 5000,
        "variants": [
            {"sku": f"{sku}-P", "name": "Camiseta Básica P", "on_hand": 10},
            {"sku": f"{sku}-M", "name": "Camiseta Básica M", "on_hand": 5}
        ]
    }
    
    prod_resp = await async_client.post("/catalog/products", json=prod_payload)
    assert prod_resp.status_code == 201
    
    data = prod_resp.json()
    assert data["sku"] == sku
    assert len(data["variants"]) == 2
    
    # 3. Check inventory
    inv_resp = await async_client.get(f"/catalog/inventory/{data['variants'][0]['sku']}")
    assert inv_resp.status_code == 200
    assert inv_resp.json()["on_hand"] == 10
    assert inv_resp.json()["reserved"] == 0
