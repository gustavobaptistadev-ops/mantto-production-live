import uuid
import pytest
from httpx import AsyncClient, ASGITransport

from mantto_api.main import app

import pytest_asyncio

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client

@pytest.mark.asyncio
async def test_create_order(async_client):
    # 1. Create Tenant
    tenant_resp = await async_client.post("/auth/tenants", json={"name": "Test Tenant"})
    assert tenant_resp.status_code == 200
    tenant_id = tenant_resp.json()["id"]

    # 2. Try to create Order
    payload = {
        "tenant_id": tenant_id,
        "customer_ref": "cust_123",
        "items": [
            {"sku": "TEST-1", "quantity": 2}
        ],
        "shipping_address": "Rua Teste, 123",
        "channel": "whatsapp"
    }
    
    uniq = str(uuid.uuid4())
    order_resp = await async_client.post("/orders", json=payload, headers={"Idempotency-Key": f"test-key-{uniq}"})
    
    # We expect 404/Not Found for now since the route doesn't exist, but we will make it 200/201.
    assert order_resp.status_code in [200, 201]
    data = order_resp.json()
    assert data["status"] == "draft"
    assert data["customer_ref"] == "cust_123"
    assert len(data["items"]) == 1
